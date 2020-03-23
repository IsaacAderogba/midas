const { objectType, inputObjectType } = require("nexus");

const AuthUser = objectType({
  name: "AuthUser",
  definition(t) {
    t.id("userId");
    t.string("firstName");
    t.string("lastName");
    t.string("avatarURL", { nullable: true });
    t.string("token");
    t.boolean("isVerified");
  }
});

const User = objectType({
  name: "User",
  definition(t) {
    t.id("id");
    t.string("firstName");
    t.string("lastName");
    t.string("email");
    t.string("avatarURL", { nullable: true });
    t.boolean("isVerified");
    t.boolean("photoId", { nullable: true });
  }
});

const LoginInput = inputObjectType({
  name: "LoginInput",
  definition(t) {
    t.string("email", { required: true });
    t.string("password", { required: true });
  }
});

const RegisterInput = inputObjectType({
  name: "RegisterInput",
  definition(t) {
    t.string("firstName", { required: true });
    t.string("lastName", { required: true });
    t.string("email", { required: true });
    t.string("password", { required: true });
    t.string("avatarURL", { required: false });
  }
});

const UserInput = inputObjectType({
  name: "UserInput",
  definition(t) {
    // exclude email and password from being updated for now
    t.string("firstName", { required: false });
    t.string("lastName", { required: false });
    t.string("avatarURL", { required: false });
    t.string("isVerified", { required: false });
    t.string("photoId", { required: false });
  }
});

module.exports = {
  AuthUser,
  User,
  LoginInput,
  RegisterInput,
  UserInput
};
