/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

const helmet = require("helmet"); // build-in middleware
const compression = require("compression"); // build-in middleware

module.exports = function(app) {
  // middleware for securing http request by setting up headers
  // secure http response from known vulnerabilities
  app.use(helmet());

  // to compress the http response that is sent to client
  app.use(compression());
};
