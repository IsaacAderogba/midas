const { db } = require("../../../db/dbConfig");
const { httpServer } = require("../../server");
const port = process.env.PORT;

module.exports = async () => {
  await db.migrate.latest();
  global.httpServer = await httpServer.listen(port, () =>
    console.log(`\nServer (test) listening on port ${port}\n`)
  );
};
