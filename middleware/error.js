/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

const winston = require("winston");

module.exports = function(err, req, res, next) {
  // error logging
  winston.error(err.message, err);

  // error (above example)
  // warn
  // info
  // verbose
  // debug
  // silly

  // error handling
  res.status(500).send("Something is failed!");
};
