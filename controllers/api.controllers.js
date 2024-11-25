const endpointsJSON = require("../endpoints.json");
const {
  fetchTopics,
  fetchArticles,
  fetchAllArticles,
} = require("../models/models");

function getApi(req, res) {
  console.log(endpointsJSON, "<----- enpoints.json");
  res.status(200).send({ endpoints: endpointsJSON });
}

function getAllTopics(req, res, next) {
  fetchTopics()
    .then((topics) => {
      console.log(topics);
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticles(req, res) {
  const { article_id } = req.params;
  fetchArticles(article_id).then((articles) => {
    res.status(200).send({ articles });
  });
}

function getAllArticles(req, res, next) {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
}

module.exports = { getApi, getAllTopics, getArticles, getAllArticles };
