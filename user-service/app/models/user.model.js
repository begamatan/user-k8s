const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      username: { type: String, unique: true },
      password: String,
      name: String,
      role: String,
    },
    {
      timestamps: true,
    }
  )
);

module.exports = User;
