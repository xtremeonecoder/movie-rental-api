/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

// include midlewares
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const asyncMiddleWare = require("../middleware/async");

// include models
const rental = require("../models/rental");
const { Movie } = require("../models/movie");
const { validateRental } = require("../models/validation");

// include libraries
const express = require("express");
const router = express.Router();

router.post(
  "/",
  [auth, validate(validateRental)],
  asyncMiddleWare(async (req, res) => {
    // if (!req.body.customerId)
    //   return res.status(400).send("Customer ID not provided!");

    // if (!req.body.movieId)
    //   return res.status(400).send("Movie ID is not provided!");

    await rental
      .getRentalByIDs(req.body.customerId, req.body.movieId)
      .then(async result => {
        // rental exists?
        if (!result) return res.status(404).send("Rental not found!");

        // is rental processed?
        if (result.returnDate)
          return res.status(400).send("Rental already processed!");

        // set return date
        result.return();
        await result.save();

        // increase movie stock
        // const thisMovie = await movie.getMovie(req.body.movieId);
        // thisMovie.numberInStock += 1;
        // await thisMovie.save();

        await Movie.update(
          { _id: result.movie._id },
          {
            $inc: { numberInStock: 1 }
          }
        );

        return res.send(result);
      })
      .catch(error => res.status(400).send(error.message));

    return res.status(401).send("Unauthorized!");
  })
);

module.exports = router;
