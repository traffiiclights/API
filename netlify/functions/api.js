"use strict";
const express = require("express");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

const router = express.Router();
router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>This is the api for the agiball!</h1>");
  res.end();
});


app.use("/.netlify/functions/api", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);