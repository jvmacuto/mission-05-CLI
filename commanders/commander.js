#!/usr/bin/env node

//import modules
const { Command } = require("commander");
const inquirer = require("inquirer");

//initialize program
const program = new Command();
const prompt = inquirer.createPromptModule();

//import the functions
const {
  addItem,
  findItem,
  updateItem,
  removeItem,
  listItems,
  seedData,
  deleteData,
} = require("../controllers/controller");

//inquirer prompt
const questions = [
  {
    type: "input",
    name: "title",
    message: "Enter the title of the item",
  },
  {
    type: "input",
    name: "description",
    message: "Enter the description of the item",
  },
  {
    type: "input",
    name: "starting_price",
    message: "Enter the starting price of the item",
    validate: (value) => !isNaN(value) || "Please enter a valid number",
  },
  {
    type: "input",
    name: "reserve_price",
    message: "Enter the reserve price of the item",
    validate: (value) => !isNaN(value) || "Please enter a valid number",
  },
];

//program version
program.version("1.0.0").description("A CLI for TradeMe");

//add command
program
  .command("add")
  .alias("a")
  .description("Add an item")
  .action(() => {
    prompt(questions).then((answers) => addItem(answers));
  });

//find command
program
  .command("find <title>")
  .alias("f")
  .description("Find an item")
  .action((title) => findItem(title));

//update command
program
  .command("update <__id>")
  .alias("u")
  .description("Update an item")
  .action((title) => {
    prompt(questions).then((answers) => updateItem(title, answers));
  });

//remove command
program
  .command("remove <__id>")
  .alias("r")
  .description("Remove an item")
  .action((title) => removeItem(title));

//list command
program
  .command("list")
  .alias("l")
  .description("List all items")
  .action(() => listItems());

//seed command
program
  .command("seed")
  .alias("s")
  .description("Seed data")
  .action(() => seedData());

//delete all data
program
  .command("delete")
  .alias("d")
  .description("Delete all data")
  .action(() => deleteData());

//run the program
program.parse(process.argv);
