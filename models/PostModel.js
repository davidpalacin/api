const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
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
  answer_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "answers",
    },
  ],
});

const PostModel = mongoose.model("posts", PostSchema);
module.exports = PostModel;

