/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

// include middleware functions
const asyncMiddleWare = require("../middleware/async");

// include express framework
const express = require("express");
const router = express.Router();

// include bcrypt for hasing password
const bcrypt = require("bcrypt");

// include models
const users = require("../models/user");
const { validateLogin } = require("../models/validation");

// login endpoint
router.post(
  "/",
  asyncMiddleWare(async (req, res) => {
    // validation
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if user exists?
    const user = await users.getOneUser({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password!");

    // match hash password
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return res.status(400).send("Invalid email or password!");

    // create json web token
    const token = user.generateAuthToken();

    // send response with jwt
    return res.send(token);
  })
);

module.exports = router;
