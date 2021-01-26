const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("./../../models/tourModels");

dotenv.config({path: "./config.env"});

const DB = process.env.DATABASE;

mongoose.connect(DB, {
  newNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  // console.log(con.connections);
  console.log("DB connection successful!");
  deleteData();
}).then(() => {
  importData();
})

//read file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"));

console.log(typeof(tours));

// import data to db

const importData = async () => {
  try{
    await Tour.create(tours);
  } catch (err) {
    console.log(err);
  }
}

//delete data in db

const deleteData = async () => {
  try{
    await Tour.deleteMany();
    console.log("Data successfully deleted")
  } catch (err) {
    console.log(err);
  }
}

console.log(process.argv);

// importData();