const endpointsJSON = require("../endpoints.json");
const {
  fetchTopics,
  fetchArticles,
  fetchAllArticles,
  fetchComments,
  postComments,
  alterVotes,
  fetchCommentsByID,
  deleteComment,

  fetchUsers,

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

function updateVotes(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad Request" });
  }

  fetchArticles(article_id)
    .then(() => {
      return alterVotes(article_id, inc_votes);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

function removeComment(req, res, next) {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
}


function getAllUsers(req, res, next) {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
}



module.exports = {
  getApi,
  getAllTopics,
  getArticles,
  getAllArticles,
  getComments,
  addComment,
  updateVotes,
  removeComment,

  getAllUsers,


};
