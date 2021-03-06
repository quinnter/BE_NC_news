const {
  selectArticles,
  selectArticleById,
  updateArticleVotes,
  selectArticleComments,
  insertArticleComment,
  insertArticle,
  removeArticleById
} = require("../models/articlesModel")

const { selectTopic } = require('../models/topicsModel')
const { selectUser } = require("../models/usersModels")

exports.getArticles = (req, res, next) => {
  const { author } = req.query
  const { topic } = req.query

  if (!author && !topic) {
    selectArticles(req.query)
      .then(articles => {
        res.status(200).send({ articles })
      })
      .catch(next)
  } else {
    Promise.all([
      author ? selectUser(author) : null,
      topic ? selectTopic(topic) : null
    ])
      .then(([author, topic]) => {
        if (author !== null && !author) return Promise.reject({ code: 404 })
        else if (topic !== null && !topic) return Promise.reject({ code: 404 })
        else return selectArticles(req.query)
      })
      .then(articles => {
        if (!articles) return Promise.reject({ code: 404 });
        else res.status(200).send({ articles })
      })
      .catch(next)
  }
}

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  selectArticleById(article_id)
    .then(article => {
      res.status(200).send({ article })
    })
    .catch(next)
}

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params
  const { inc_votes } = req.body
  updateArticleVotes(article_id, inc_votes)
    .then(article => {
      res.status(200).send({ article })
    })
    .catch(next)
}

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params
  const { sort_by, order } = req.query
  selectArticleComments(article_id, sort_by, order)
    .then(comments => {
    //   if (comments.length === 0) {
    //     selectArticleById(article_id)
    //   } 
    // })
    // .then(article => {
    //   if (!article) return Promise.reject({ code: 404 });
    //   else res.status(200).send({ comments })
    if (!comments) return Promise.reject({ code: 404 })
    else res.status(200).send({ comments })
    })
    .catch(next)
}

exports.postArticleComment = (req, res, next) => {
  const { article_id } = req.params
  const { username, body } = req.body
  const newCommentKeys = { article_id, author: username, body }
  insertArticleComment(newCommentKeys)
    .then(([comment]) => {
      if (!comment) return Promise.reject({ code: '23503' })
      else res.status(201).send({ comment })
    })
    .catch(next)
}

exports.postArticle = (req, res, next) => {
  const { title, body, username, topic } = req.body
  const newArticleKeys = { title, body, author: username, topic }
  insertArticle(newArticleKeys)
    .then(([article]) => {
      if (!article) return Promise.reject({ code: 404 })
      else res.status(201).send({ article })
    })
    .catch(next)
}

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params
  removeArticleById(article_id)
  .then(result => {
    if (result === 1) res.sendStatus(204)
    else return Promise.reject({ code: 404 })
  })
  .catch(next)
}