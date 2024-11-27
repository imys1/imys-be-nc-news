//const { getArticles } = require("../controllers/api.controllers");
const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
}

function fetchArticles(articleId) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `Article ${articleId} not found`,
        });
      }
      return rows[0];
    });
}

function fetchAllArticles() {
  const queryText = `SELECT
  articles.article_id,
  articles.title,
  articles.author,
  articles.topic,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
   CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;`;
  return db.query(queryText).then(({ rows }) => {
    return rows;
  });
}

function fetchComments(article_id) {
  const query = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;
  return db.query(query, [article_id]).then(({ rows, rowCount }) => {
    if (rowCount === 0) {
      return Promise.reject({ status: 404 });
    }
    return rows;
  });
}

function postComments(username, body, article_id) {
  return db
    .query(
      `INSERT INTO comments
    (author, body, article_id)
    VALUES ($1, $2 , $3)
    RETURNING *;
`,

      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchAllArticles,
  fetchComments,
  postComments,
};
