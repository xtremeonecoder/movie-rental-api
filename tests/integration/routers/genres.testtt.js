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
const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const { Genre } = require("../../../models/genre");

describe("/api/genres", () => {
  beforeEach(() => {
    // before every execution it will call index
    server = require("../../../index");
  });

  afterEach(async () => {
    await Genre.remove({}); // dynamically remove data at last
    await server.close(); // close server at last
  });

  describe("GET /", () => {
    it("Returns a list of genres!", async () => {
      // dynamically insert
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" }
      ]);

      // send http requests
      const res = await request(server).get("/api/genres");

      // tests
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(genre => genre.name === "genre1")).toBeTruthy();
      expect(res.body.some(genre => genre.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    // test genre exists
    it("Returns a genre object for valid id", async () => {
      // add a genre
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      // fetch the genre
      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    // check genre id is not valid
    it("Returns 404 error, when genre ID is invalid!", async () => {
      const res = await request(server).get("/api/genres/1");
      expect(res.status).toBe(404);
    });

    // check genre doesn't exist
    it("Returns 404 error, when genre does not exist!", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    let token, genreName;

    // common executer function
    const execute = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: genreName });
    };

    beforeEach(() => {
      // generate valid token
      genreName = "genre1";
      token = new User().generateAuthToken();
    });

    // check auth
    it("Returns 401, if user is not authenticate!", async () => {
      // set token empty by force
      token = "";

      // send post request
      const res = await execute();

      // test auth failed?
      expect(res.status).toBe(401);
    });

    // check validation (minimum length)
    it("Returns 400, if genre length less than 2 characters!", async () => {
      // set genre name
      genreName = "1";

      // send post request
      const res = await execute();

      // test validation failed? Bad request!
      expect(res.status).toBe(400);
    });

    // check validation (maximum length)
    it("Returns 400, if genre length more than 50 characters!", async () => {
      // set genre name
      genreName = new Array(52).join("a");

      // send post request
      const res = await execute();

      // test validation failed? Bad request!
      expect(res.status).toBe(400);
    });

    // check if post send successfully?
    it("Returns 200, if POST request is successful!", async () => {
      // send post request
      const res = await execute();

      // get the genre from database
      const genre = await User.find({ name: "genre1" });

      // test if POST request is successful?
      expect(res.status).toBe(200);
      expect(genre).not.toBeNull();
    });

    // check if data saved?
    it("Returns a valid genre object!", async () => {
      // send post request
      const res = await execute();

      // test if genre is saved?
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let genreName, genre, token;

    beforeEach(async () => {
      // insert dummy data for test
      genre = new Genre({ name: "genre1" });
      await genre.save();

      // get auth token
      genreName = "genre-modified";
      token = new User().generateAuthToken();
    });

    const execute = () => {
      return request(server)
        .put("/api/genres/" + genre._id)
        .set("x-auth-token", token)
        .send({ name: genreName });
    };

    it("Returns 200 and valid genre object on success!", async () => {
      // send request
      const res = await execute();

      // test some units
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre-modified");
    });

    it("Returns 401 error, if token is empty!", async () => {
      token = "";
      const res = await execute();
      expect(res.status).toBe(401);
    });

    it("Returns 400, if token is not valid!", async () => {
      token = "a";
      const res = await execute();
      expect(res.status).toBe(400);
    });

    it("Returns 400, if validation fails!", async () => {
      genreName = "a";
      const res = await execute();
      expect(res.status).toBe(400);
    });

    it("Returns 404, if genre not found for given ID!", async () => {
      genre._id = mongoose.Types.ObjectId();
      const res = await execute();
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /:id", () => {
    let genre, token;
    beforeEach(async () => {
      // insert dummy data
      genre = new Genre({ name: "genre1" });
      await genre.save();

      // generate valid token
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    const execute = () => {
      return request(server)
        .delete("/api/genres/" + genre._id)
        .set("x-auth-token", token);
    };

    it("Returns 200, if genre deleted!", async () => {
      const res = await execute();
      genre = await Genre.find({ name: "genre1" });
      expect(res.status).toBe(200);
      expect(genre.name).not.toBeDefined();
    });

    it("Returns 401, if token is empty!", async () => {
      token = "";
      const res = await execute();
      expect(res.status).toBe(401);
    });

    it("Returns 400, if invalid token provided!", async () => {
      token = "a";
      const res = await execute();
      expect(res.status).toBe(400);
    });

    it("Returns 403, if user is not admin!", async () => {
      token = new User().generateAuthToken();
      const res = await execute();
      expect(res.status).toBe(403);
    });

    it("Returns 404, if object ID is invalid!", async () => {
      genre._id = null;
      const res = await execute();
      expect(res.status).toBe(404);
    });

    it("Returns 404, if genre not found!", async () => {
      genre._id = mongoose.Types.ObjectId();
      const res = await execute();
      expect(res.status).toBe(404);
    });
  });
});
