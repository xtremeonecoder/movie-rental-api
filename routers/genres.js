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
const genres = require("../models/genre");
const { validateGenre } = require("../models/validation");

// include express framework
const express = require("express");
const router = express.Router();

// fetch all documents
router.get(
  "/",
  asyncMiddleWare(async (req, res) => {
    //throw new Error("Unable to get genres!");
    await genres
      .getGenres()
      .then(result => {
        if (!result) return res.status(400).send("Something went wrong!");
        return res.send(result);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// fetch one document
router.get(
  "/:id",
  validateObjectId,
  asyncMiddleWare(async (req, res) => {
    await genres
      .getGenre(req.params.id)
      .then(genre => {
        if (!genre) return res.status(404).send("Requested genre not found!");
        return res.send(genre);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// create new document
router.post(
  "/",
  [auth],
  asyncMiddleWare(async (req, res) => {
    // validation
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // preparing data
    let genre = { name: req.body.name };

    // creating
    await genres
      .createGenre(genre)
      .then(genre => {
        if (!genre) return res.status(400).send("Something went wrong!");
        return res.send(genre);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// update document
router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    // validation
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // prepare data
    let genre = { name: req.body.name };

    // updating
    await genres
      .updateGenre(req.params.id, genre)
      .then(genre => {
        if (!genre) return res.status(404).send("Something went wrong!");
        return res.send(genre);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// delete document
router.delete(
  "/:id",
  [auth, admin, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    await genres
      .removeGenre(req.params.id)
      .then(genre => {
        if (!genre) return res.status(404).send("Something went wrong!");
        return res.send(genre);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

module.exports = router;
