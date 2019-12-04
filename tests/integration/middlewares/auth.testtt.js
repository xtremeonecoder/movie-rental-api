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

describe("Auth Middleware", () => {
  let token;

  beforeEach(() => {
    // before every execution it will call index
    server = require("../../../index");
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await Genre.remove({}); // dynamically remove data at last
    await server.close(); // close server at last
  });

  const execute = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre3" });
  };

  it("Returns 401 error, if token not found!", async () => {
    token = "";
    const res = await execute();
    expect(res.status).toBe(401);
  });

  it("Returns 400 error, if token is invalid!", async () => {
    token = null;
    const res = await execute();
    expect(res.status).toBe(400);
  });

  it("Returns 200 success status, if valid token passed!", async () => {
    const res = await execute();
    expect(res.status).toBe(200);
  });
});
