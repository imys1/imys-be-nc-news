const endpointsJSON = require("../endpoints.json");
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
require("jest-sorted");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJSON);
      });
  });
});

describe("GET /api/topics", () => {
  test("returns with an array with the properties of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(data.topicData.length);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

test("404 error with custom message saying not found", () => {
  return request(app)
    .get("/noturl")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Not Found");
    });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with the correct article when passed an article id", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.article_id).toBe(5);
        expect(articles).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("returns an array of aricles with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("returns with an array of article objects sorted by created_at in descending order ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("returns array of comments with appropriate properties", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(2);
      });
  });
});
test("comments should return the most recent one first ", () => {
  return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body: { comments } }) => {
      expect(comments).toBeSorted({ descending: true });
    });
});

test.only("404 error for endpoint request to non existent articles ", () => {
  return request(app)
    .get("/api/articles/98/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("URL not found");
    });
});
