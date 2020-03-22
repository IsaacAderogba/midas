const { objectType, inputObjectType } = require("nexus");

const AuthUser = objectType({
  name: "AuthUser",
  definition(t) {
    t.id("userId");
    t.string("firstName");
    t.string("lastName");
    t.string("avatarURL", { nullable: true });
    t.string("token");
  }
});

const UserInput = inputObjectType({
  name: "UserInput",
  definition(t) {
    t.string("firstName", { required: true });
    t.string("lastName", { required: true });
    t.string("email", { required: true });
    t.string("password", { required: true });
    t.string("avatarURL", { required: false });
  }
});

module.exports = {
  AuthUser,
  UserInput
};
