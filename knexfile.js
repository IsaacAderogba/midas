// Todo - investigate __dirname
// TODO - create PROCFILE so heroku runs knex migrate:latest
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
  },
  staging: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: __dirname + "/db/migrations",
      tableName: "db_migrations"
    },
    seeds: {
      directory: __dirname + "/db/seeds"
    },
    useNullAsDefault: true
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
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
