"use strict";
const express = require("express");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");

// Hafas
const createClient = require("hafas-client");
const vvtProfile = require("hafas-client/p/vvt");
const client = createClient(vvtProfile, "api");

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
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>This is the API from traficlights!</h1>");
  res.end();
});

router.get("/stops", async (req, res) => {
  const stops = await client.locations(req.query.search, {
    stops: true,
    poi: false,
    addresses: false,
    linesOfStops: true,
    results: 1,
  });
  res.json({ station: req.query.search, stops: stops, amount: stops.length });
});

router.get("/departures", async (req, res) => {
  const departures = await client.departures(req.query.id, { duration: 5 });
  const resArr = [];
  departures.forEach((element) => {
    const oneDeparture = {};
    oneDeparture.when = calcMinutes(element.when);
    oneDeparture.line = element.line.name;
    oneDeparture.direction = element.direction
    resArr.push(oneDeparture);
  });
  res.json({ dept: resArr });
});

app.use("/.netlify/functions/api", router); // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
