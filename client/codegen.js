module.exports = {
  schema: "http://localhost:5000/graphql",
  documents: ["./src/**/*.tsx", "./src/**/*.ts", './src/**/*.graphql'],
  overwrite: true,
  generates: {
    "./src/generated/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ],
      config: {
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,
      }
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    }
  }
};
