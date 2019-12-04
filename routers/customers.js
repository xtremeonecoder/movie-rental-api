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
const customers = require("../models/customer");
const { validateCustomer } = require("../models/validation");

// include express framework
const express = require("express");
const router = express.Router();

// fetch all
router.get(
  "/",
  asyncMiddleWare(async (req, res) => {
    await customers
      .getCustomers()
      .then(result => {
        if (!result) return res.status(404).send("Customers not found!");
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
    await customers
      .getCustomer(req.params.id)
      .then(customer => {
        if (!customer) return res.status(404).catch("Customer not found!");
        return res.send(customer);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// create
router.post(
  "/",
  auth,
  asyncMiddleWare(async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    };

    await customers
      .createCustomer(customer)
      .then(customer => {
        if (!customer) return res.status(400).send("Somethine went wrong!");
        return res.send(customer);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// update
router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold
    };

    await customers
      .updateCustomer(req.params.id, customer)
      .then(customer => {
        if (!customer) return res.status(400).send("Something went wrong!");
        return res.send(customer);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

// delete
router.delete(
  "/:id",
  [auth, admin, validateObjectId],
  asyncMiddleWare(async (req, res) => {
    await customers
      .removeCustomer(req.params.id)
      .then(customer => {
        if (!customer) return res.status(404).send("Customer not found!");
        return res.send(customer);
      })
      .catch(error => res.status(400).send(error.message));
  })
);

module.exports = router;
