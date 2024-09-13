const mongoose = require("mongoose");

//item schema
const itemSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  starting_price: {
    type: Number,
  },
  reserve_price: {
    type: Number,
  },
});

//export model
module.exports = mongoose.model("Item", itemSchema);
