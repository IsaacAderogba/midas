// ITodo - handle errors - use sentry
const bcrypt = require("bcryptjs");
const UserModel = require("./userModels");
const { generateToken } = require("./userUtils");

module.exports = {
  getUser: async function() {},
  updateUser: async function() {},
  registerUser: async function(user) {
    try {
      const hash = await bcrypt.hash(user.password, 12);
      user.password = hash;
    } catch (err) {
      console.log(err);
    }

    try {
      const userId = await UserModel.insertUser(user);
      if (userId) {
        let userDetails = await UserModel.findUser({ id: userId });
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
  },
  deleteUser: async function() {},
  loginUser: async function() {}
};
