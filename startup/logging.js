/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

const winston = require("winston");
require("winston-mongodb");

module.exports = function() {
  // include error handler and logger
  winston.add(
    new winston.transports.File({
      filename: "logfile.log",
      handleExceptions: true
    })
  );

  // include error handler and logger (MongoDB)
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "error"
    })
  );

  /////////// Uncaught & Unhandled Exceptions ///////////
  // catching uncaught exceptions
  // but in modern winston we dont need to add this
  // process.on("uncaughtException", ex => {
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });

  // // catching unhandled rejections
  // process.on("unhandledRejection", ex => {
  //   winston.error(ex.message, ex);
  //   process.exit(1);
  // });
  /////////// Uncaught & Unhandled Exceptions ///////////

  /////////// Uncaught & Unhandled Exceptions (Another Way) ///////////
  // winston.handleExceptions( // deprecated
  winston.exceptions.handle(
    // for logging error on console
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true,
      handleExceptions: true
    }),
    // for logging error on file
    new winston.transports.File({
      filename: "uncaughtExceptions.log",
      handleExceptions: true
    })
  );

  // catching unhandled rejections
  process.on("unhandledRejection", ex => {
    throw ex;
  });

  // const p = Promise.reject(new Error("This is unhandled promise!"));
  // p.then(console.log("Done"));
  /////////// Uncaught & Unhandled Exceptions (Another Way) ///////////
};
