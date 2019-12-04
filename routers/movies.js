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

// include models
const movies = require("../models/movie");
const { getGenre } = require("../models/genre");
const { validateMovie } = require("../models/validation");

// include express framework
const express = require("express");
const router = express.Router();

// fetch all
router.get(
  "/",
  asyncMiddleWare(async (req, res) => {
    await movies
      .getMovies()
      .then(result => {
        if (!result) return res.status(404).send("No movie found!");
        return res.send(result);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// fetch one
router.get(
  "/:id",
  validateObjectId,
  asyncMiddleWare(async (req, res) => {
    await movies
      .getMovie(req.params.id)
      .then(movie => {
        if (!movie) return res.status(404).send("No movie found!");
        return res.send(movie);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// create
router.post(
  "/",
  auth,
  asyncMiddleWare(async (req, res) => {
    // validate data
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get genre
    const genre = await getGenre(req.body.genreId);
    if (!genre) return res.status(404).send("Invalid genre given!");

    // prepare data
    let movie = {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    };

    // create
    await movies
      .createMovie(movie)
      .then(movie => {
        if (!movie) return res.status(400).send("Something went wrong!");
        return res.send(movie);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// update
router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    // validate data
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get genre
    const genre = await getGenre(req.body.genreId);
    if (!genre) return res.status(404).send("Invalid genre given!");

    // prepare data
    let movie = {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    };

    // update
    await movies
      .updateMovie(req.params.id, movie)
      .then(movie => {
        if (!movie) return res.status(404).send("No movie found!");
        return res.send(movie);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// delete
router.delete(
  "/:id",
  [auth, admin, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    await movies
      .removeMovie(req.params.id)
      .then(movie => {
        if (!movie) return res.status(404).send("No movie found!");
        return res.send(movie);
      })
      .catch();
  })
);

module.exports = router;
