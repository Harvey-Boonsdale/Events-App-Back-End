require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
("");
const morgan = require("morgan");
const app = express();

const { ObjectId } = require("mongodb");
const { User } = require("./Model");
const { Event } = require("./Model");

const port = process.env.PORT;
const url = process.env.CONNECTION_STRING;

// adding Helmet to enhance your API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));
app.use(
  express.json({
    origin: ["http://localhost:3000", "https://events-app-403y.onrender.com"],
  })
);

// Front end sends request for user to login
// if credentials are valid
// send secret to allow past middleware

app.post("/auth", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.sendStatus(401);
  }
  if (user.password !== req.body.password) {
    return res.sendStatus(404);
  }
  return res.send({ token: "secretString" });
});

app.get("/users", async (req, res) => {
  res.send(await User.find());
});

// Custom Middleware for Authentication

app.use((req, res, next) => {
  if (req.headers.authorization === "secretString") {
    next();
  } else {
    res.sendStatus(403);
  }
});

// Create an event

app.post("/events", async (req, res) => {
  if (
    !req.body.name ||
    !req.body.location ||
    !req.body.info ||
    !req.body.date ||
    !req.body.time
  ) {
    return res.sendStatus(400);
  }
  const event = new Event({
    name: req.body.name,
    location: req.body.location,
    info: req.body.info,
    date: req.body.date,
    time: req.body.time,
  });
  await event.save();
  res.send("Event Added!");
});

// Read list of events+

app.get("/events", async (req, res) => {
  const events = await Event.find();
  res.send(events);
});

// Delete event

app.delete("/events/:id", async (req, res) => {
  const response = await Event.deleteOne({ _id: ObjectId(req.params.id) });
  if (response.deletedCount) {
    return res.send({ result: true });
  } else {
    res.sendStatus(404);
  }
});

// Edit Event

app.put("/events/:id", async (req, res) => {
  const event = await Event.findOne({ _id: ObjectId(req.params.id) });
  if (!event) {
    return res.sendStatus(404);
  }
  console.log(req.body);
  if (
    !req.body.name ||
    !req.body.location ||
    !req.body.info ||
    !req.body.date ||
    !req.body.time
  ) {
    return res.sendStatus(400);
  }

  event.name = req.body.name;
  event.location = req.body.location;
  event.info = req.body.info;
  event.date = req.body.date;
  event.time = req.body.time;

  await event.save();
  res.send("Event Changed!");
});

mongoose.connect(url);
app.listen(port, () => {
  console.log("server is live on port " + port);
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Database Connected");
});
