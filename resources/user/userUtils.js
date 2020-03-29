const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server-express")

const userQueryKeys = {
  user: "user",
};

const userResolverKeys = {
  loginUser: "loginUser",
  registerUser: "registerUser",
  updateUser: "updateUser",
  deleteUser: "deleteUser"
};

const userErrors = {
  UserAlreadyExists: new UserInputError("User already exists"),
  UserNotFound: new UserInputError("User not found"),
  EmailPasswordWrong: new UserInputError("Incorrect email/password combination")
}

const generateToken = ({ id, firstName, lastName }) => {
  const payload = {
    userId: id,
    firstName,
    lastName
  };

  const options = {
    expiresIn: "14d"
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

module.exports = {
  userQueryKeys,
  userResolverKeys,
  userErrors,
  generateToken
};
