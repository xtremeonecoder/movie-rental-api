/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

// include middleware functions
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleWare = require("../middleware/async");
const validateObjectId = require("../middleware/validate-object-id");

// include lodash, for common operations
const _ = require("lodash");

// include bcrypt package for password hashing
const bcrypt = require("bcrypt");

// include express framework
const express = require("express");
const router = express.Router();

// include models
const users = require("../models/user");
const { validateUser } = require("../models/validation");

// fetch all
router.get(
  "/",
  asyncMiddleWare(async (req, res) => {
    await users
      .getUsers()
      .then(result => {
        if (!result) return res.status(404).send("Users not found!");
        return res.send(result);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// fetch one
router.get(
  "/me",
  [auth],
  asyncMiddleWare(async (req, res) => {
    await users
      .getUser(req.user._id)
      .then(user => {
        if (!user) return res.status(404).send("User not found!");
        return res.send(user);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// create api
router.post(
  "/",
  asyncMiddleWare(async (req, res) => {
    // validation
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check user exists or not?
    let user = await users.getOneUser({ email: req.body.email });
    if (user) return res.status(400).send("User already exists!");

    // prepare data
    user = _.pick(req.body, ["name", "email", "password"]);

    // hashing password
    const saltRounds = 10;
    await bcrypt
      .hash(user.password, saltRounds)
      .then(hash => {
        if (!hash) return res.status(400).send("Password hashing failed!");
        user.password = hash;
      })
      .catch(error => res.status(400).send(error));

    // create user
    await users
      .createUser(user)
      .then(user => {
        // check if user created?
        if (!user) return res.status(400).send("Something went wrong!");

        // create json-web-token
        const token = user.generateAuthToken();

        // send response with user data and token header
        return res
          .header("x-auth-token", token) // assign token in the header
          .header("access-control-expose-headers", "x-auth-token") // to enable token visible in the header
          .send(_.pick(user, ["_id", "name", "email"]));
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// update user
router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    // validation
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // prepare data
    let user = _.pick(req.body, ["name", "email"]);

    // update
    await users
      .updateUser(req.params.id, user)
      .then(user => {
        if (!user) return res.status(400).send("Something went wrong!");
        return res.send(_.pick(user, ["_id", "name", "email"]));
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// delete user
router.delete(
  "/:id",
  [auth, admin, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    await users
      .removeUser(req.params.id)
      .then(user => {
        if (!user) return res.status(404).send("Something went wrong!");
        return res.send(user);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

module.exports = router;
