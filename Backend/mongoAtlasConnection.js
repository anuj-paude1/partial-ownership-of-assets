require("dotenv").config();
const mongoose = require("mongoose");
// const uri = `mongodb+srv://enigma:${process.env.PASSWORD}@enigmaestates.ce7td52.mongodb.net/?retryWrites=true&w=majority`;
// mongoose.connect(uri, { dbName: "Enigma" }).then(() => {
//   console.log("CONNECTED TO DATABASE");
// });

const uri = "mongodb://127.0.0.1:27017/EnigmaEstates";
mongoose.connect(uri).then(() => {
  console.log("CONNECTED");
});
