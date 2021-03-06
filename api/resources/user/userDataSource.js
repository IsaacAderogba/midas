// TODO - Error Handling
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const { SQLDataSource } = require("datasource-sql");
const { generateToken } = require("./userUtils");
const { knexConfig } = require("../../../db/dbConfig");
const WorkspaceUserAPI = require("../workspace_user/workspaceUserDataSource");
const Mailer = require("../../services/email/Mailer");
const verificationTemplate = require("../../services/email/verificationTemplate");
const { cloudinaryStreamUpload } = require("../utils");

// const MINUTE = 60;
const USER_TABLE = "User";

class UserAPI extends SQLDataSource {
  async registerUser(user) {
    let password;
    try {
      const hash = await bcrypt.hash(user.password, 12);
      password = hash;
    } catch (err) {
      console.log(err);
      throw err;
    }

    try {
      const userId = await this._createUser({ ...user, password });
      if (userId) {
        let userDetails = await this._readUser({ id: userId });

        if (process.env.DB_ENV !== "test") {
          const subject = "Please confirm your email";
          const mailer = new Mailer(
            { subject, email: userDetails.email },
            verificationTemplate(userDetails.token)
          );

          await mailer.send();
        }

        return {
          userId: userDetails.id.toString(),
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          avatarURL: userDetails.avatarURL,
          isVerified: userDetails.isVerified,
          token: generateToken(userDetails),
        };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async loginUser({ email, password }) {
    const userDetails = await this._readUser({ email });
    try {
      if (
        userDetails &&
        (await bcrypt.compare(password, userDetails.password))
      ) {
        return {
          userId: userDetails.id.toString(),
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          avatarURL: userDetails.avatarURL,
          isVerified: userDetails.isVerified,
          token: generateToken(userDetails),
        };
      }
      return null;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async deleteUser(whereObj) {
    try {
      const isSuccess = await this._deleteUser(whereObj);
      if (isSuccess) return true;
      return false;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async updateUser(whereObj, user) {
    try {
      if (user.file) {
        const fetchedUser = await this.readUser(whereObj);
        const public_id = fetchedUser.photoId ? fetchedUser.photoId : v4();

        const { createReadStream } = await user.file;
        const stream = createReadStream();

        const image = await cloudinaryStreamUpload({ stream, public_id });
        user.photoId = image.public_id;
        user.avatarURL = image.secure_url;
        delete user.file;
      }

      return this._updateUser(whereObj, user);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async readUser(whereObj) {
    try {
      return this._readUser(whereObj);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   *
   * Parses authorization header for workspaceId and jwtToken
   */
  async authenticateUser(authorization) {
    // authheader looks like: 'workspaceId-jwtToken'
    const authHeader = authorization;
    // TODO - make this failure proof
    const [workspaceId, token] = authHeader
      ? authHeader.split(" ")
      : [false, false];

    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await this._readUser({ id: decodedToken.userId });
        if (user) {
          const authUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
          };

          if (workspaceId && workspaceId !== "null") {
            const workspaceUser = await WorkspaceUserAPI._readWorkspaceUser({
              userId: user.id,
              workspaceId,
            });

            if (workspaceUser) {
              authUser.role = workspaceUser.role;
              authUser.workspaceUserId = workspaceUser.id;
              authUser.workspaceId = workspaceUser.workspaceId;
            }
          }

          return authUser;
        }
        return null;
      } catch (err) {
        console.log(err);
        throw err;
      }
    }
    return null;
  }

  async _createUser(user) {
    return this.knex(USER_TABLE)
      .insert(user)
      .returning("id")
      .then(([id]) => id);
  }

  _readUser(whereObj) {
    return this.knex(USER_TABLE).where(whereObj).first();
  }

  async _updateUser(whereObj, user) {
    return this.knex(USER_TABLE)
      .where(whereObj)
      .update(user)
      .returning("*")
      .then(([user]) => user);
  }

  _deleteUser(whereObj) {
    return this.knex(USER_TABLE).where(whereObj).del();
  }
}

module.exports = new UserAPI(knexConfig);
