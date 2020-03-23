const bcrypt = require("bcryptjs");
const { SQLDataSource } = require("datasource-sql");
const { generateToken } = require("./userUtils");
const { knexConfig } = require("../../db/dbConfig");


const MINUTE = 60;
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
          token: generateToken(userDetails)
        };
      }
    } catch (err) {
      console.log(err);
    }
  }
  async loginUser() {}
  async deleteUser() {}
  async updateUser() {}
  async getUser() {}

  _createUser(user) {
    return this.knex(TABLE)
      .insert(user)
      .returning("id")
      .then(([id]) => id);
  }

  _readUser(whereObj) {
    return this.knex(TABLE)
      .where(whereObj)
      .first()
      .cache(MINUTE);
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
