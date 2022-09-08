const mongoose = require("mongoose");

const { url } = require("../configs/db.config");

mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = url;
db.user = require("./user.model");

module.exports = db;
