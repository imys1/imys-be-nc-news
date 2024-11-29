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

function fetchAllArticles(topic, sort_by = "created_at", order = "desc") {
  console.log(topic);

  const queryValues = [];
  const validSortBy = [
    "article_id",
    "title",
    "author",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const validOrder = ["asc", "desc"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort_by or order query",
    });
  }

  let queryText = `SELECT
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
`;

  if (topic !== undefined) {
    queryValues.push(topic);
    queryText += `WHERE topic LIKE $1 GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
  } else {
    queryText += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;
  }

  return db.query(queryText, queryValues).then(({ rows }) => {
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

function alterVotes(article_id, inc_votes) {
  const queryToUpdate = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
  return db.query(queryToUpdate, [inc_votes, article_id]).then(({ rows }) => {
    return rows;
  });
}

function deleteComment(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      console.log(rows.length);
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
}
function fetchUsers() {
  return db.query(`SELECT * FROM users`).then(({ rows: users }) => {
    return users;
  });
}

module.exports = {
  fetchTopics,
  fetchArticles,
  fetchAllArticles,
  fetchComments,
  postComments,
  alterVotes,
  deleteComment,
  fetchUsers,
};
