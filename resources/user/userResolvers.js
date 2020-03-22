const { userQueryKeys } = require("./userUtils");
const { extendType } = require("nexus");

const Query = extendType({
  type: "Query",
  definition(t) {
    t.field(userQueryKeys.helloWorld, {
      type: "String",
      resolve: (parent, args) => {
        console.log(args);
        return "Hello World";
      }
    });
  }
});

module.exports = {
  userQuery: Query
};
