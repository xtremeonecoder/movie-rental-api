/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

// include express
const express = require("express");
const cors = require("cors");

const errorMiddleWare = require("../middleware/error"); // custom middleware
// const morgan = require("morgan"); // build-in middleware

// const dbDebugger = require("debug")("app:db"); // debug = npm-package
// const startupDebugger = require("debug")("app:startup"); // debug = npm-package

// const home = require("../routers/home"); // express router
const auth = require("../routers/auth"); // express router
const users = require("../routers/users"); // express router
const genres = require("../routers/genres"); // express router
const movies = require("../routers/movies"); // express router
const rentals = require("../routers/rentals"); // express router
const returns = require("../routers/returns"); // express router
const customers = require("../routers/customers"); // express router

module.exports = function(app) {
  // Templating Engine - PUG
  // app.set("view engine", "pug"); // this will require pug inside
  // app.set("views", "./views"); // assigning view files directory (optional)

  // environment
  // console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  // console.log(`Get Env: ${app.get("env")}`);

  // config - npm package for managing configuration as per environment
  // configuration set to development.json or production.json
  // config folder contains all the json files
  // console.log("Name: " + config.get("name"));
  // console.log("Mail: " + config.get("mail.host"));
  // configuration set to custom-environment-variables.json
  //console.log("Password: " + config.get("mail.password")); // gives error if not set

  // Debug - npm package debugging
  // dbDebugger("Database debugging...");
  // startupDebugger("Startup debugging...");

  // enables cors (enables sending request from cross-browsers)
  app.use(cors());

  // adding json as a middle ware to express
  app.use(express.json());

  // custom middle ware function for logging
  //app.use(logger);

  // custom middle ware function for authenticating
  //app.use(authenticate);

  // middleware for processing urlencoded values
  app.use(express.urlencoded({ extended: true }));

  // static middleware
  //app.use(express.static("public")); // public folder for public assets

  // middleware of express framework for logging http request details
  //app.use(morgan("tiny"));

  // use routers (place routers below all the used middlewares)
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/genres", genres);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/returns", returns);
  app.use("/api/customers", customers);

  // error handler middleware
  app.use(errorMiddleWare);
};
