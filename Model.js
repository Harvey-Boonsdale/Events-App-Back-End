const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  token: String,
});

const eventSchema = mongoose.Schema({
  name: String,
  location: String,
  info: String,
  date: String,
  time: String,
});

module.exports.User = mongoose.model("User", userSchema);
module.exports.Event = mongoose.model("Event", eventSchema);
