const endpointsJSON = require("../endpoints.json");
const { fetchTopics } = require("../models/models");

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

module.exports = { getApi, getAllTopics };
