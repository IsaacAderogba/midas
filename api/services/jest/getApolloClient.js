require("cross-fetch/polyfill");
const ApolloBoost = require("apollo-boost").default;

const getApolloClient = (token) => {
  return new ApolloBoost({
    uri: "http://localhost:5000/graphql",
    request: (operation) => {
      operation.setContext({
        headers: {
          authorization: token ? token : "",
        },
      });
    },
  });
};

module.exports = {
  getApolloClient,
};
