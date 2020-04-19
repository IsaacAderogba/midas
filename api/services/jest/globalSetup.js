const { db } = require("../../../db/dbConfig");
const server = require("../../server");
const port = process.env.PORT;

module.exports = async () => {
  await db.migrate.latest();
  global.httpServer = await server.listen(port, () =>
    console.log(`\nServer (test) listening on port ${port}\n`)
  );
};
