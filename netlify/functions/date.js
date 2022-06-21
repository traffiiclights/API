"use strict";
const express = require("express");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

// moment
var moment = require("moment");

const calcMinutes = (from) => {
  var now = moment().utc();
  var dep = moment.utc(from);

  var dif = dep.subtract(now).format("mm");

  return dif;
};

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ date: moment().format("dd.MM") });
});

app.use("/.netlify/functions/date", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
