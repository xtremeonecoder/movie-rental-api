/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

const config = require("config"); // configuration
const winston = require("winston"); // Error Logger
const express = require("express"); // RESTfull API
const app = express(); // RESTfull API

// include error logging
require("./startup/logging")();

// connect to mongodb database
require("./startup/connection")();

// include configurations
require("./startup/config")();

// include routes
require("./startup/routes")(app);

// include production middleware packages
require("./startup/production")(app);

// define port
const port = process.env.PORT || config.get("port");
const server = app.listen(port, () =>
  winston.info(`Listening to port ${port}`)
);

module.exports = server;
