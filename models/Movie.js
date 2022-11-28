const mongoose = require("mongoose");

const Movie = mongoose.model("Movie", {
  title: String,
  desc: String,
  tag: String,
});

module.exports = Movie;
