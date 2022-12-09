require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const { ObjectId } = require("mongodb");
const { Event } = require("./Model");

const port = process.env.PORT;
const url = process.env.CONNECTION_STRING;

app.use(express.json());

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

mongoose.connect(url);
app.listen(port, () => {
  console.log("server is live on port " + port);
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Database Connected");
});
