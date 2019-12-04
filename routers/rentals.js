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
const rentals = require("../models/rental");
const { getMovie } = require("../models/movie");
const { getCustomer } = require("../models/customer");
const { validateRental } = require("../models/validation");

// include mangoose library
const mongoose = require("mongoose");

// include fawn package for transaction
const Fawn = require("fawn");
Fawn.init(mongoose);

// include express framework
const express = require("express");
const router = express.Router();

// fetch all
router.get(
  "/",
  auth,
  asyncMiddleWare(async (req, res) => {
    await rentals
      .getRentals()
      .then(result => {
        if (!result) return res.status(404).send("Rentals not found!");
        return res.send(result);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// fetch one
router.get(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    await rentals
      .getRental(req.params.id)
      .then(rental => {
        if (!rental) return res.status(404).send("Rental not found!");
        return res.send(rental);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// create
router.post(
  "/",
  auth,
  asyncMiddleWare(async (req, res) => {
    // validation
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // // validate movieId
    // if (mongoose.Types.ObjectId.isValid(req.body.movieId))
    //   return res.status(400).send("Invalid movie ID!");

    // get movie
    const movie = await getMovie(req.body.movieId);
    if (!movie) return res.status(404).send("Movie not found!");

    // // validate customer id
    // if (mongoose.Types.ObjectId.isValid(req.body.customerId))
    //   return res.status(400).send("Invalid customer ID");

    // get customer
    const customer = await getCustomer(req.body.customerId);
    if (!customer) return res.status(404).send("Customer not found!");

    // check movie stock
    if (movie.numberInStock === 0)
      return res.status(400).send("Movie not in stock!");

    // prepare data
    let rental = {
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      },
      //   rentalDate:
      //   returnDate:
      rentalFee: req.body.rentalFee
    };

    // save
    // await rentals
    //   .createRental(rental)
    //   .then(rental => {
    //     if (!rental) return res.status(400).send("Something went wrong!");
    //     return res.send(rental);
    //   })
    //   .catch(error => res.status(400).send(error.message));

    // start transaction
    try {
      // save rental and update movie
      new Fawn.Task()
        .save("rentals", rental) // save rental
        .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } }) // update movie
        .run();

      // send response
      return res.send(rental);
    } catch (error) {
      return res.status(500).send("Something went wrong!", error);
    }
  })
);

// update
router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    // validation
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // get movie
    const movie = await getMovie(req.body.movieId);
    if (!movie) return res.status(404).send("Movie not found!");

    // get customer
    const customer = await getCustomer(req.body.customerId);
    if (!customer) return res.status(404).send("Customer not found!");

    // // check movie stock
    // if (movie.numberInStock === 0)
    //   return res.status(400).send("Movie not in stock!");

    // prepare data
    let rental = {
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate
      },
      //   rentalDate:
      //   returnDate:
      rentalFee: req.body.rentalFee
    };

    // update
    await rentals
      .updateRental(req.params.id, rental)
      .then(rental => {
        if (!rental) return res.status(400).send("Something went wrong!");
        return res.send(rental);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// delete
router.delete(
  "/:id",
  [auth, admin, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    await rentals
      .removeRental(req.params.id)
      .then(rental => {
        if (!rental) return res.status(404).send("Rental not found!");
        return res.send(rental);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

module.exports = router;
