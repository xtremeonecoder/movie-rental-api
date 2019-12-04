/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

const mongoose = require("mongoose");

// document schema
const schemaGenre = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 50,
    trim: true,
    required: true
  }
});

// document model
const Genre = mongoose.model("Genre", schemaGenre);

// fetch all
async function getGenres() {
  return await Genre.find().sort({ name: 1 });
}

// fetch one
async function getGenre(id) {
  return await Genre.findById(id);
}

// create
async function createGenre(data) {
  const genre = new Genre(data);
  return await genre.save();
}

// update
async function updateGenre(id, data) {
  return await Genre.findByIdAndUpdate(id, data, { new: true });
}

// delete
async function removeGenre(id) {
  return await Genre.findByIdAndRemove(id);
}

module.exports = {
  getGenres,
  getGenre,
  createGenre,
  updateGenre,
  removeGenre,
  Genre,
  schemaGenre
};
