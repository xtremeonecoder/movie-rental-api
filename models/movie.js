/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

const mongoose = require("mongoose");
const { Genre, schemaGenre } = require("./genre");

// document schema (movies)
const schemaMovie = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    trim: true
  },
  genre: {
    // embedded genre
    type: schemaGenre,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
    trim: true
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    trim: true
  }
});

// document model (movies)
const Movie = mongoose.model("Movie", schemaMovie);

// fetch all
async function getMovies() {
  return await Movie.find();
}

// fetch one
async function getMovie(id) {
  return await Movie.findById(id);
}

// create
async function createMovie(data) {
  // prepare data
  const movie = new Movie({
    title: data.title,
    genre: new Genre({
      _id: data.genre._id,
      name: data.genre.name
    }),
    numberInStock: data.numberInStock,
    dailyRentalRate: data.dailyRentalRate
  });

  // save data
  return await movie.save();
}

// update
async function updateMovie(id, data) {
  // prepare data
  // const movie = new Movie({
  //   title: data.title,
  //   genre: new Genre({
  //     _id: data.genre._id,
  //     name: data.genre.name
  //   }),
  //   numberInStock: data.numberInStock,
  //   dailyRentalRate: data.dailyRentalRate
  // });

  // update
  return await Movie.findByIdAndUpdate(id, data, { new: true });
}

// delete
async function removeMovie(id) {
  return await Movie.findByIdAndRemove(id);
}

module.exports = {
  Movie,
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  removeMovie
};
