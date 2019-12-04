/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

// include jsonwebtoken package
const jwt = require("jsonwebtoken");

// include config for app configuration
const config = require("config");

// include mongoose framework
const mongoose = require("mongoose");

// document schema
const schema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 5,
    required: true
  },
  isAdmin: Boolean
});

// Information Expert Principle
// create json web token here
// for accessing like - [user.generateAuthToken()]
schema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      isAdmin: this.isAdmin
    },
    config.get("jwtPrivateKey")
  );
};

// document model
const User = mongoose.model("User", schema);

// get all
async function getUsers() {
  return await User.find()
    .select({ name: 1, email: 1 })
    .sort({ name: 1 });
}

// fetch one
async function getUser(id) {
  return await User.findById(id).select({ password: 0 });
}

// get one
async function getOneUser(data) {
  return await User.findOne(data);
}

// create
async function createUser(data) {
  const user = new User(data);
  return await user.save();
}

// update
async function updateUser(id, data) {
  return await User.findByIdAndUpdate(id, data, { new: true });
}

// delete
async function removeUser(id) {
  return await User.findByIdAndRemove(id);
}

module.exports = {
  User,
  getUsers,
  getUser,
  getOneUser,
  createUser,
  updateUser,
  removeUser
};
