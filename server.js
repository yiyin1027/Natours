const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({path: "./config.env"});

const DB = process.env.DATABASE;

mongoose.connect(DB, {
  newNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => {
  // console.log(con.connections);
  console.log("DB connection successful!");
})

const port = process.env.port;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
