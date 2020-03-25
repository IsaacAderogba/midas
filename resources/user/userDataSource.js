// TODO - Error Handling
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SQLDataSource } = require("datasource-sql");
const { generateToken } = require("./userUtils");
const { knexConfig } = require("../../db/dbConfig");

// const MINUTE = 60;
const USER_TABLE = "User";

class UserAPI extends SQLDataSource {
  async registerUser(user) {
    try {
      const hash = await bcrypt.hash(user.password, 12);
      user.password = hash;
    } catch (err) {
      console.log(err);
      throw err;
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
      await this._updateUser(whereObj, user);
      return await this._readUser(whereObj)
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
    return this.knex(USER_TABLE)
      .where(whereObj)
      .first();
  }

  async _updateUser(whereObj, user) {
    return this.knex(USER_TABLE)
      .where(whereObj)
      .update(user)
      .returning("id")
      .then(([id]) => id);
  }

  _deleteUser(whereObj) {
    return this.knex(USER_TABLE)
      .where(whereObj)
      .del();
  }
}

module.exports = new UserAPI(knexConfig);
