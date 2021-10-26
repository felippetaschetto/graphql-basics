require("@babel/register");
require("@babel/polyfill/noConflict");
const dotenv = require("dotenv");
dotenv.config({ path: `./${process.env.NODE_ENV}/.env` });

const server = require("../../src/server").default;

module.exports = async () => {
  console.log("TESTING 1");
  global.httpServer = await server.start({ port: 4000 });
  //console.log("instance", instance);
};
