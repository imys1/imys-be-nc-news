const endpointsJSON = require("../endpoints.json");
const {
  fetchTopics,
  fetchArticles,
  fetchAllArticles,
  fetchComments,
  postComments,
} = require("../models/models");

function getApi(req, res) {
  res.status(200).send({ endpoints: endpointsJSON });
}

function getAllTopics(req, res, next) {
  fetchTopics()
    .then((topics) => {
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

function getComments(req, res, next) {
  const { article_id } = req.params;
  fetchArticles(article_id)
    .then(() => {
      return fetchComments(article_id);
    })
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
}

function addComment(req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;
  fetchArticles(article_id)
    .then(() => {
      return postComments(username, body, article_id);
    })
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch(next);
}

// find article to post comment too

module.exports = {
  getApi,
  getAllTopics,
  getArticles,
  getAllArticles,
  getComments,
  addComment,
};
