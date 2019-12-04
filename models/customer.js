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
const schemaCustomer = new mongoose.Schema({
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
});

// document model
const Customer = mongoose.model("Customer", schemaCustomer);

// fetch all
async function getCustomers() {
  return await Customer.find().sort({ name: 1 });
}

// fetch one
async function getCustomer(id) {
  return await Customer.findById(id);
}

// create
async function createCustomer(data) {
  const customer = new Customer(data);
  return await customer.save();
}

// update
async function updateCustomer(id, data) {
  return await Customer.findByIdAndUpdate(id, data, { new: true });
}

// delete
async function removeCustomer(id) {
  return await Customer.findByIdAndRemove(id);
}

module.exports = {
  getCustomer,
  getCustomers,
  createCustomer,
  updateCustomer,
  removeCustomer
};
