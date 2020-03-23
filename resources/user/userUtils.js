const jwt = require("jsonwebtoken");

const userQueryKeys = {
  helloWorld: "helloWorld",
  loginUser: "loginUser",
  user: "user"
};

const userResolverKeys = {
  registerUser: "registerUser",
  updateUser: "updateUser",
  deleteUser: "deleteUser"
};

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
  generateToken
};
