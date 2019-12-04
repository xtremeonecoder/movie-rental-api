/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

// include npm-packages
const config = require("config");

module.exports = function() {
  // check if environment variable exists and set
  if (!config.has("jwtPrivateKey") || !config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not set!");
  }
};
