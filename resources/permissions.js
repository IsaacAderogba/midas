const { rule } = require("graphql-shield");

const ROLES = {
  owner: "owner",
  admin: "admin",
  editor: "editor",
  viewer: "viewer"
};

const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx) => {
    return ctx.user !== null;
  }
);

module.exports = {
  isAuthenticated,
  ROLES
};
