const mongoose = require("mongoose");

const Movie = mongoose.model("Movie", {
  title: String,
  desc: String,
  tag_id: String,
  url: String,
});

module.exports = Movie;
