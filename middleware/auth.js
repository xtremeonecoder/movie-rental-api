/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // bypass authentication
  if (!config.get("requiresAuth")) return next();

  const token = req.header("x-auth-token");

  // check if token exists?
  if (!token) return res.status(401).send("Access denied! Token not found!");

  // check if token valid?
  try {
    const decodedPayload = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decodedPayload;
    next();
  } catch (error) {
    return res.status(400).send("Invalid token provided!");
  }
};
