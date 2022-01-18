"use strict";
const express = require("express");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

// Webuntis
const WebUntisLib = require("webuntis");
const untis = new WebUntisLib.WebUntisAnonymousAuth(
  "htl1-innsbruck",
  "neilo.webuntis.com"
);

const router = express.Router();
router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>This is the API from traficlights!</h1>");
  res.end();
});

router.get("/classes", async (req, res) => {
  await untis.login();
  const classes = await untis.getClasses();
  res.json({ classes: classes });
});

app.use("/.netlify/functions/webuntis", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
