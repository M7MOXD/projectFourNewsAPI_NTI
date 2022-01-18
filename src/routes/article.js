// require express
const express = require('express');

// require routers from express
const routers = express.Router();

// require Article
const Article = require('../models/article');

// require auth
const auth = require('../middleware/auth');

// Routes
// POST Route "New Article"
routers.post('/narticle', auth, async (req, res) => {
  // Create New Article Based On data Send from request
  try {
    const newArticle = await new Article({
      ...req.body,
      reporter: req.reporter._id,
    });
    newArticle.save();
    res.send(newArticle);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// GET Route "All Articles"
routers.get('/articles', auth, async (req, res) => {
  try {
    await req.reporter.populate('articles');
    const articles = req.reporter.articles;
    if (articles.length === 0) {
      return res.status(404).send('No articles Available');
    }
    res.send(articles);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// GET Route "Article"
routers.get('/articles/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const article = await Article.findOne({ _id, owner: req.reporter._id });
    if (!article) {
      return res.status(404).send('Unable to fine the Article');
    }
    res.send(article);
  } catch (e) {
    res.status(404).send(e.message);
  }
});

// PATCH Route "UPDATE Article"
routers.patch('/articles/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const article = await Article.findOneAndUpdate(
      { _id, owner: req.reporter.owner },
      req.body,
      {
        // return new data after update
        new: true,
        // check model validator
        runValidators: true,
      }
    );
    if (!article) {
      return res.status(404).send('Unable to fine the Article');
    }
    res.send(article);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// Delete Route "Delete Article"
routers.delete('/articles/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const article = await Article.findOneAndDelete({
      _id,
      owner: req.reporter._id,
    });
    if (!article) {
      return res.status(404).send('Unable to fine the Article');
    }
    res.send('Article Deleted');
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// export routers
module.exports = routers;
