import "@babel/polyfill/noConflict";
import dotenv from "dotenv";
import server from "./server";

dotenv.config({ path: `./${process.env.NODE_ENV}/.env` });

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

// TODO: Create, update, delete Post and Comments

server.start(() => {
  console.log("server is UP! on http://localhost:4000");
});
