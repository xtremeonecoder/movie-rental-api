/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

const config = require("config");
const winston = require("winston");
const mongoose = require("mongoose");

// establish mongodb connection
module.exports = function() {
  const db = config.get("database");
  mongoose.connect(db).then(() => console.log(`Database ${db} connected...`));
  //mongoose.connect(db).then(() => winston.info(`Database ${db} connected...`));
};
