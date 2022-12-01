const mongoose = require("mongoose");

const Tag = mongoose.model("Tag", {
  tag: String,

  //confimpassword: String
});

module.exports = Tag;
