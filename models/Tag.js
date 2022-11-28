const mongoose = require("mongoose");

const Tag = mongoose.model("Tag", {
  tag: String,
  title_tag: String,

  //confimpassword: String
});

module.exports = Tag;
