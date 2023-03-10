const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  author: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
    required: true,
  },
});

const AnswerModel = mongoose.model("answers", AnswerSchema);
module.exports = AnswerModel;

