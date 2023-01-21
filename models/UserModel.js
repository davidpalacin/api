const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  },
  post_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
  answer_ids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "answers",
    },
  ],
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;

