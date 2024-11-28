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
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
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

test("400 error for endpoint request to non existent articles ", () => {
  return request(app)
    .get("/api/articles/98/comments")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article 98 not found");
    });
});

describe("POST/api/articles/:article_id/comments", () => {
  test("it will return the posted comment with a username and body", () => {
    const newComment = { username: "icellusedkars", body: "It's a good day" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.newComment).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            comment_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
});
test("returns a bad request 400 for usernames not in database", () => {
  const newComment = {
    username: "Marcus5152",
    body: "Can I plz leave a comment",
  };

  return request(app)
    .post(`/api/articles/2/comments`)
    .send(newComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});

test("returns 'Article Not Found' and status code 404 when comments are made to non existent articles", () => {
  const newComment = {
    username: "rogersop",
    body: "I love article 1256",
  };

  return request(app)
    .post(`/api/articles/1256/comments`)
    .send(newComment)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Article 1256 not found");
    });
});

test("returns bad request for comments with wrong keys example not username/body ", () => {
  const newComment = {
    profileName: "SSJGoku101",
    torso: "Hello my name is Goku",
  };

  return request(app)
    .post(`/api/articles/2/comments`)
    .send(newComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});

test("returns a bad request when an empty object is sent through", () => {
  return request(app)
    .post(`/api/articles/2/comments`)
    .send({})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad Request");
    });
});

describe("PATCH /api/articles/:article_id", () => {
  test("updates the article with the correct count vote incremented by 100", () => {
    const votes = { inc_votes: 100 };
    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual({
          article: [
            {
              article_id: 1,
              title: "Living in the shadow of a great man",
              topic: "mitch",
              author: "butter_bridge",
              body: "I find this existence challenging",
              created_at: "2020-07-09T20:11:00.000Z",
              votes: 200,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            },
          ],
        });
      });
  });
});

test("updates the article witht he vote count decremented by 75 ", () => {
  const votes = { inc_votes: -75 };
  return request(app)
    .patch("/api/articles/1")
    .send(votes)
    .expect(200)
    .then((res) => {
      const articleTest = res.body.article;
      articleTest.forEach((element) => {
        expect(element.votes).toBe(25);
      });
    });
});

test("returns 'Bad Request for incorrect body requests'", () => {
  return request(app)
    .patch(`/api/articles/1`)
    .send({ test_votes: false })
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe("Bad Request");
    });
});

test("returns 'Article not found' and the status code 404 for articles that are not in the database", () => {
  return request(app)
    .patch(`/api/articles/5000`)
    .send({ inc_votes: 20 })
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe("Article 5000 not found");
    });
});

test("returns 'Bad Request' and the status code 400 for invalid paths", () => {
  return request(app)
    .patch(`/api/articles/apple`)
    .send({ inc_votes: 20 })
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe("Bad Request");
    });
});

describe("DELETE/api/comments/id", () => {
  test("deletes the comment when given an ID and responds with a 204 status", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
});

test("after a comment is deleted we should see a 404 eror as it should not exist", () => {
  return request(app)
    .get("/api/comments/1")
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe("Not Found");
    });
});

test("will return 'Comment not found' when you try delete a non existent comment", () => {
  return request(app)
    .delete("/api/comments/555")
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe(`Comment not found`);
    });
});

test("returns a 'bad request' when trying to delete with a word instead of a number", () => {
  return request(app)
    .delete("/api/comments/dawnblade")
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe(`Bad Request`);
    });
});
