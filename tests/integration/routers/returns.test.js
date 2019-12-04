/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

let server;
const moment = require("moment");
const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const { Movie } = require("../../../models/movie");
const { Rental } = require("../../../models/rental");

describe("POST /", () => {
  let token, movie, rental, movieId, customerId;

  beforeEach(async () => {
    server = require("../../../index");

    token = new User().generateAuthToken();

    movieId = mongoose.Types.ObjectId();
    customerId = mongoose.Types.ObjectId();

    // insert a movie
    movie = new Movie({
      _id: movieId,
      title: "Terminator",
      genre: {
        _id: mongoose.Types.ObjectId(),
        name: "Action"
      },
      numberInStock: 4,
      dailyRentalRate: 2
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        isGold: false,
        name: "12345",
        phone: "12345"
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2
      }
    });
    await rental.save();
  });

  afterEach(async () => {
    await Rental.remove({});
    await Movie.remove({});
    await server.close();
  });

  const execute = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ movieId: movieId, customerId: customerId });
  };

  it("Returns 401, if client is not logged in!", async () => {
    token = "";
    const res = await execute();
    expect(res.status).toBe(401);
  });

  it("Returns 400, if customer ID is not provided!", async () => {
    customerId = null;
    const res = await execute();
    expect(res.status).toBe(400);
  });

  it("Returns 400, if movie ID is not provided!", async () => {
    movieId = null;
    const res = await execute();
    expect(res.status).toBe(400);
  });

  it("Returns 404, if rental is not found!", async () => {
    await Rental.remove({});
    const res = await execute();
    expect(res.status).toBe(404);
  });

  it("Returns 400, if rental already processed!", async () => {
    // return date set?
    rental.returnDate = new Date();
    await rental.save();
    const res = await execute();
    expect(res.status).toBe(400);
  });

  it("Returns 200, if rental returned successfully!", async () => {
    const res = await execute();
    const result = await Rental.findById(rental._id);
    expect(res.status).toBe(200);
    expect(result).not.toBeNull();
  });

  it("Should set return-date of rental!", async () => {
    const res = await execute();
    const result = await Rental.findById(rental._id);
    const timeDifference = new Date() - result.returnDate;
    expect(res.status).toBe(200);
    expect(result.returnDate).toBeDefined();
    // less than 10 seconds
    expect(timeDifference).toBeLessThan(10 * 1000);
  });

  it("Calculates rental fees and sets in database!", async () => {
    // set 7 days back
    rental.rentalDate = moment()
      .add(-7, "days")
      .toDate();
    await rental.save();

    const res = await execute();
    const result = await Rental.findById(rental._id);
    expect(res.status).toBe(200);
    expect(result.rentalFee).toBeDefined();
    expect(result.rentalFee).toBeGreaterThan(0);
    expect(result.rentalFee).toBe(14);
  });

  it("Should increase the number of stock!", async () => {
    const res = await execute();
    const movieUpdated = await Movie.findById(movieId);
    expect(res.status).toBe(200);
    expect(movieUpdated.numberInStock).toBe(movie.numberInStock + 1);
  });

  it("Returns the updated rental object!", async () => {
    const res = await execute();
    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "customer",
        "movie",
        "rentalDate",
        "returnDate",
        "rentalFee"
      ])
    );
  });
});
