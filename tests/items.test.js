const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const Item = require("../models/model.js");
const app = require("../index"); // Adjust the path as necessary
const {
  addItem,
  updateItem,
  findItem,
  listItems,
  removeItem,
  seedData,
  deleteData,
} = require("../controllers/controller");

//mock the item model
jest.mock("../models/model.js");

// Test for the GET /items route
describe("get /api/items", () => {
  beforeAll(async () => {
    //connect to the database
    await mongoose.connect("mongodb://localhost:27017/trademedb");
  });

  afterAll(async () => {
    //disconnect from the database
    await mongoose.connection.close();
  });

  //search test
  it("should return items based on search query", async () => {
    const item = [{ title: "ps5" }];

    Item.find.mockResolvedValue(item);

    const response = await request(app).get("/api/items?search=ps5");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(item);
  });

  it("should return 500 if error retrieving items", async () => {
    Item.find.mockRejectedValue(new Error("Error retrieving items"));

    const response = await request(app).get("/api/items?search=ps5");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Error retrieving items" });
  });
});

//test if the controllers are working properly
describe("Controller Tests", () => {
  beforeAll(async () => {
    // Connect to a test database
    const url = `mongodb://127.0.0.1/test_database`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect from the test database
    await mongoose.connection.close();
  });

  //add an item
  it("should add an item successfully", async () => {
    const mockItem = { title: "New Item" };

    Item.create.mockResolvedValue(mockItem);

    const consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});

    await addItem(mockItem);

    expect(consoleSpy).toHaveBeenCalledWith("New item added to data.json");
    consoleSpy.mockRestore();
  });

  //update an item
  it("should update an item successfully", async () => {
    const mockItem = { _id: "123", title: "Item to be updated" };

    Item.findByIdAndUpdate.mockResolvedValue(mockItem);

    const consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});

    await updateItem(mockItem._id, mockItem);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Item updated successfully:",
      mockItem
    );
    consoleSpy.mockRestore();
  });

  //find an item
  it("should find an item successfully", async () => {
    const mockItem = [{ title: "Item to be found" }];

    Item.find.mockResolvedValue(mockItem);

    const consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});

    await findItem("Item to be found");

    expect(consoleSpy).toHaveBeenCalledWith(mockItem);
    expect(consoleSpy).toHaveBeenCalledWith(`${mockItem.length} matches`);
    consoleSpy.mockRestore();
  });

  //remove an item
  it("should remove an item successfully", async () => {
    const mockItem = { _id: "123", title: "Item to be removed" };

    Item.findByIdAndDelete.mockResolvedValue(mockItem);

    const consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});

    await removeItem(mockItem._id);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Item removed successfully:",
      mockItem
    );
    consoleSpy.mockRestore();
  });

  //list all items
  it("should list all items successfully", async () => {
    const mockItems = [{ title: "Item1" }, { title: "Item2" }];

    Item.find.mockResolvedValue(mockItems);

    const consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});

    await listItems();

    expect(consoleSpy).toHaveBeenCalledWith(mockItems);
    consoleSpy.mockRestore();
  });

  //seed data
  it("should seed data successfully", async () => {
    const mockItems = [{ title: "Item1" }, { title: "Item2" }];

    Item.insertMany.mockResolvedValue(mockItems);

    const consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});

    await seedData();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Data seeded successfully: ",
      mockItems
    );
    consoleSpy.mockRestore();
  });

  //delete data from the database
  it("should delete data successfully", async () => {
    Item.deleteMany.mockResolvedValue({ n: 1 });

    const consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});

    await deleteData();

    expect(consoleSpy).toHaveBeenCalledWith("Data deleted successfully");
    consoleSpy.mockRestore();
  });

  //return 'Item not found' if item does not exist
  it("should log 'Item not found' if item does not exist", async () => {
    Item.findByIdAndDelete.mockResolvedValue(null);

    const consoleSpy = jest.spyOn(console, "info").mockImplementation(() => {});

    await removeItem("nonexistent_id");

    expect(consoleSpy).toHaveBeenCalledWith("Item not found");
    consoleSpy.mockRestore();
  });
});
