/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi); // for working with mongodb objectid

function validateGenre(data) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required()
      .label("Genre")
  };

  return Joi.validate(data, schema);
}

function validateMovie(data) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(255)
      .required()
      .label("Title"),
    genreId: Joi.objectId()
      .required()
      .label("Genre"),
    //name: Joi.required().label("Genre"),
    numberInStock: Joi.number()
      .min(0)
      .max(255)
      .required()
      .label("Number in Stock"),
    dailyRentalRate: Joi.number()
      .min(0)
      .max(10)
      .required()
      .label("Rate")
  };

  return Joi.validate(data, schema);
}

function validateCustomer(data) {
  const schema = {
    isGold: Joi.boolean().label("isGold"),
    name: Joi.string()
      .min(5)
      .max(255)
      .required()
      .label("Name"),
    phone: Joi.string()
      .min(5)
      .max(12)
      .required()
      .label("Phone")
  };

  return Joi.validate(data, schema);
}

function validateRental(data) {
  const schema = {
    movieId: Joi.objectId()
      .required()
      .label("Movie"),
    customerId: Joi.objectId()
      .required()
      .label("Customer"),
    rentalFee: Joi.number().label("Rental fee")
  };

  return Joi.validate(data, schema);
}

function validateUser(data) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .label("Name"),
    email: Joi.string()
      .email()
      .required()
      .label("Email"),
    password: Joi.string()
      .min(5)
      .required()
      .label("Password")
  };

  return Joi.validate(data, schema);
}

function validateLogin(data) {
  const schema = {
    email: Joi.string()
      .email()
      .required()
      .label("Email"),
    password: Joi.string()
      .min(5)
      .required()
      .label("Password")
  };

  return Joi.validate(data, schema);
}

module.exports = {
  validateGenre,
  validateMovie,
  validateCustomer,
  validateRental,
  validateUser,
  validateLogin
};
