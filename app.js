const express = require("express");
const app = express();
const {
  getApi,
  getAllTopics,
  getArticles,
  getAllArticles,
} = require("./controllers/api.controllers");

app.get("/api", getApi);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticles);
app.get("/api/articles/", getAllArticles);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  console.log(err.code);
  next();
});

app.use((req, res) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
