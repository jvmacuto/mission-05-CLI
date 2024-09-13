//import modules
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

//map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connec to db
mongoose
  .connect("mongodb://localhost:27017/trademedb")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//import the model
const Item = require("../models/model");

//the following commands are used to add, find, update, remove, and list items from the database
//it's important to note that the database must be running in order to use these commands
//to run the commands, use the following syntax:
// Add item
const addItem = (item) => {
  /*Item.create(item).then((item) => {
    console.info("New item added");
    mongoose.connection.close();
  });*/
  const dataPath = path.join(__dirname, "../data/data.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  data.push(item);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf-8");
  console.info("New item added to data.json");
  mongoose.connection.close();
};

// Find item
const findItem = (title) => {
  const search = new RegExp(title, "i");
  Item.find({ title: search })
    .then((items) => {
      if (items.length === 0) {
        console.info("Item not found");
      } else {
        console.info(items);
        console.info(`${items.length} matches`);
      }
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error finding item:", err);
      mongoose.connection.close();
    });
};

// Update item
const updateItem = (_id, item) => {
  Item.findByIdAndUpdate(_id, item, { new: true })
    .then((updatedItem) => {
      if (!updatedItem) {
        console.info("Item not found");
      } else {
        console.info("Item updated successfully:", updatedItem);
      }
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error updating item:", err);
      mongoose.connection.close();
    });
};

//remove item
const removeItem = (_id) => {
  Item.findByIdAndDelete(_id)
    .then((removedItem) => {
      if (!removedItem) {
        console.info("Item not found");
      } else {
        console.info("Item removed successfully:", removedItem);
      }
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error removing item:", err);
      mongoose.connection.close();
    });
};

//list all items
const listItems = () => {
  Item.find()
    .then((items) => {
      if (items.length === 0) {
        console.info("No items found");
      } else {
        console.info(items);
        console.info(`${items.length} items found`);
      }
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error listing items:", err);
      mongoose.connection.close();
    });
};

//seed data
const seedData = () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/data.json"), "utf-8")
  );
  Item.insertMany(data)
    .then((items) => {
      console.info("Data seeded successfully: ", items);
      //clear the data.json file after seeding into mongodb
      fs.writeFileSync(
        path.join(__dirname, "../data/data.json"),
        "[]",
        "utf-8"
      );
      console.info("Data.json cleared");
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error seeding data: ", err);
      mongoose.connection.close();
    });
};

//delete all data
const deleteData = () => {
  Item.deleteMany({})
    .then(() => {
      console.info("Data deleted successfully");
      mongoose.connection.close();
    })
    .catch((err) => {
      console.error("Error deleting data: ", err);
      mongoose.connection.close();
    });
};

//export the functions
module.exports = {
  addItem,
  findItem,
  updateItem,
  removeItem,
  listItems,
  seedData,
  deleteData,
};
