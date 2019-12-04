/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");

describe("Auth Middleware", () => {
  it("Returns an user payload!", () => {
    const user = {
      isAdmin: true,
      _id: mongoose.Types.ObjectId().toHexString()
    };
    const token = new User(user).generateAuthToken();
    const req = {
      // mocking "req" object
      header: jest.fn().mockReturnValue(token)
    };
    const res = {}; // mocking "res" object
    const next = jest.fn(); // mocking "next" function

    // technique is - first write the function you wanna test and
    // then make changes as per the test demands, such as - requiring
    // external dependency files and mocking functions and parameters
    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
