/**
 * Movie Rental - RESTfull-API
 *
 * @category   Application_Backend
 * @package    movie-rental-api
 * @author     Suman Barua
 * @developer  Suman Barua <sumanbarua576@gmail.com>
 **/

let server;
const request = require("supertest");
const { User } = require("../../../models/user");
const { Genre } = require("../../../models/genre");

describe("Admin Middleware", () => {
  let genre, token;
  beforeEach(async () => {
    server = require("../../../index");
    genre = new Genre({ name: "genre-5" });
    await genre.save();
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await Genre.remove({});
    await server.close();
  });

  it("Returns 403, if user is not admin!", async () => {
    const res = await request(server)
      .delete("/api/genres/" + genre._id)
      .set("x-auth-token", token);

    expect(res.status).toBe(403);
  });
});
