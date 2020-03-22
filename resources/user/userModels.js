const db = require("../../db/dbConfig");

const table = "User";
module.exports = {
  insertUser: function(user) {
    return db("User")
      .insert(user)
      .returning("id")
      .then(([id]) => id);
  },
  findUser: function(whereObj) {
    return db(table)
      .where(whereObj)
      .first();
  },
  updateUser: function(whereObj, user) {
    return db(table)
      .where(whereObj)
      .update(user);
  },
  removeUser: function(whereObj) {
    return db(table)
      .where(whereObj)
      .del();
  }
};
