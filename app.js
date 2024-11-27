const express = require("express");
const app = express();
const {
  getApi,
  getAllTopics,
  getArticles,
  getAllArticles,
  getComments,
  addComment,
} = require("./controllers/api.controllers");

app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticles);
app.get("/api/articles/", getAllArticles);
app.get("/api/articles/:article_id/comments", getComments);
app.post("/api/articles/:article_id/comments", addComment);
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use("*", (req, res, next) => {
  res.status(404).send({ msg: "URL not found" });
});
app.use((err, req, res, next) => {
  if (err.code === "23502" || err.code === "23503" || err.code === "22PO2") {
    res.status(400).send({ msg: "Bad Request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((req, res) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
