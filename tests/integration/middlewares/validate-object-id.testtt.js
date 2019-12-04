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

describe("ValidateObjectID Middleware", () => {
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await server.close();
  });

  it("Returns 404 error for invalid object id!", async () => {
    const res = await request(server).get("/api/genres/1");
    expect(res.status).toBe(404);
  });
});
