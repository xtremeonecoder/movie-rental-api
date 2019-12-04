/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

// async error handler middleware
// implementing a comman try-catch block
module.exports = function(handler) {
  return async (req, res, next) => {
    try {
      // router handler or middleware
      // fucntion is called here
      await handler(req, res);
    } catch (error) {
      // if error occured,
      // convey the error to next process
      next(error);
    }
  };
};
