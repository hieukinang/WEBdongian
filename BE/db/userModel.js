const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {type : String},
  password: { type: String},
  is_login: {type : Boolean},
  first_name: { type: String },
  last_name: { type: String },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
});

module.exports =  mongoose.model("Users", userSchema);
