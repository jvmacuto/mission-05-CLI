//import modules
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

//middleware
app.use(bodyParser.json());

//mongoose connection
mongoose
  .connect("mongodb://localhost:27017/trademedb")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

//import the model
const Item = require("./models/model");

app.get("/api/items", async (req, res) => {
  const { search } = req.query;
  const searchRegex = new RegExp(search, "i");

  try {
    const items = await Item.find({ title: searchRegex });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving items" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
