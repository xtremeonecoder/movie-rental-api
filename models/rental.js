/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

const moment = require("moment");
const mongoose = require("mongoose");

// document schema
const schemaRental = new mongoose.Schema({
  customer: new mongoose.Schema({
    isGold: {
      type: Boolean,
      required: true
    },
    name: {
      type: String,
      minlength: 5,
      maxlength: 255,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      minlength: 5,
      maxlength: 12,
      required: true,
      trim: true
    }
  }),
  movie: new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      trim: true
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      trim: true
    }
  }),
  rentalDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  returnDate: {
    type: Date
  },
  rentalFee: {
    type: Number,
    min: 0
  }
});

// Information Expert Principle
// set return date and rental-fees
schemaRental.methods.return = function() {
  this.returnDate = new Date();
  const days = moment().diff(this.rentalDate, "days");
  this.rentalFee = this.movie.dailyRentalRate * days;
};

// document model
const Rental = mongoose.model("Rental", schemaRental);

// fetch all
async function getRentals() {
  return await Rental.find().sort({ rentalDate: -1 });
}

// fetch one
async function getRental(id) {
  return await Rental.findById(id);
}

async function getRentalByIDs(customerID, movieID) {
  return await Rental.findOne({
    "movie._id": movieID,
    "customer._id": customerID
  });
}

// create
async function createRental(data) {
  const rental = new Rental(data);
  return await rental.save();
}

// update
async function updateRental(id, data) {
  return await Rental.findByIdAndUpdate(id, data, { new: true });
}

// delete
async function removeRental(id) {
  return await Rental.findByIdAndRemove(id);
}

module.exports = {
  Rental,
  getRental,
  getRentals,
  createRental,
  updateRental,
  removeRental,
  getRentalByIDs
};
