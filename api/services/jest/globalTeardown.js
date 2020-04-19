const { db } = require("../../../db/dbConfig");

module.exports = async () => {
  await db.migrate.rollback();
  await db.destroy()
  await global.httpServer.close();
};
