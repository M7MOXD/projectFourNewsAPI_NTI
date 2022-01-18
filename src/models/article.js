// require mongoose
const mongoose = require('mongoose');

// Create Article Schema
const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

// Create model Article
const Article = mongoose.model('Article', articleSchema);

// export User
module.exports = Article;
