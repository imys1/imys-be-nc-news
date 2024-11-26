const express = require("express");
const app = express();
const {
  getApi,
  getAllTopics,
  getArticles,
} = require("./controllers/api.controllers");

app.get("/api", getApi);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticles);
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});
module.exports = app;
