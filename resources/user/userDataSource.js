// TODO - Error Handling
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SQLDataSource } = require("datasource-sql");
const { generateToken } = require("./userUtils");
const { knexConfig } = require("../../db/dbConfig");

// const MINUTE = 60;
const TABLE = "User";

class UserAPI extends SQLDataSource {
  async registerUser(user) {
    try {
      const hash = await bcrypt.hash(user.password, 12);
      user.password = hash;
    } catch (err) {
      console.log(err);
    }

    try {
      const userId = await this._createUser(user);
      if (userId) {
        let userDetails = await this._readUser({ id: userId });
        return {
          userId: userDetails.id.toString(),
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          avatarURL: userDetails.avatarURL,
          isVerified: userDetails.isVerified,
          token: generateToken(userDetails)
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
          token: generateToken(userDetails)
        };
      }
      return null;
    } catch (err) {
      console.log(err);
    }
  }

  async deleteUser(whereObj) {
    const userToBeDeleted = await this._readUser(whereObj);
    try {
      await this._deleteUser(whereObj);
      return userToBeDeleted;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async updateUser(whereObj, user) {
    await this._updateUser(whereObj, user);
    return await this._readUser(whereObj);
  }
  async getUser(whereObj) {
    return this._readUser(whereObj);
  }

  async authenticateUser(req) {
    const token = req.headers.authorization;
    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await this._readUser({ id: decodedToken.userId });
        if (user)
          return {
            id: user.id,
            isAuthenticated: true
          };
        return null;
      } catch (err) {
        console.log(err);
      }
    }
    return null;
  }

  async _createUser(user) {
    return this.knex(TABLE)
      .insert(user)
      .returning("id")
      .then(([id]) => id);
  }

  _readUser(whereObj) {
    return this.knex(TABLE)
      .where(whereObj)
      .first();
  }

  _updateUser(whereObj, user) {
    return this.knex(TABLE)
      .where(whereObj)
      .update(user);
  }

  _deleteUser(whereObj) {
    return this.knex(TABLE)
      .where(whereObj)
      .del();
  }
}

module.exports = new UserAPI(knexConfig);
