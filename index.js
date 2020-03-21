const server = require("./api/server");
const port = process.env.PORT;

server.listen(port, () => console.log(`\nServer listening on port ${port}\n`));
