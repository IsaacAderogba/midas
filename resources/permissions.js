const { rule } = require("graphql-shield");


const isAuthenticated = rule({ cache: "contextual" })(
  async (parent, args, ctx) => {
    return ctx.user !== null;
  }
);

module.exports = {
  isAuthenticated
}