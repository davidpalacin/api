const Post = require("../models/PostModel.js");
const User = require("../models/UserModel.js");
const Answer = require("../models/AnswerModel.js");

exports.create = async (req, res) => {
  const { answerText } = req.body;
  const answer = new Answer({
    author,
    content,
    likes,
    user_id,
    post_id,
  });
};
