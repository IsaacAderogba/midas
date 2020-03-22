const db = require("../../db/dbConfig");

const table = "User";
module.exports = {
  findUser: function(whereObj) {
    return db(table)
      .where(whereObj)
      .first();
  },
  updateUser: function(whereObj, userObj) {
    return db(table)
      .where(whereObj)
      .update(userObj);
  },
  removeUser: function(whereObj) {
    return db(table)
      .where(whereObj)
      .del();
  }
};
