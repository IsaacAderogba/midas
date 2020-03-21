// Todo - investigate __dirname
module.exports = {
  development: {
    client: "pg",
    connection: "postgres://localhost/midas",
    migrations: {
      directory: __dirname + "/db/migrations",
      tableName: "db_migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds"
    },
    useNullAsDefault: true
  }
};
