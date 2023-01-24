const Post = require("../models/PostModel.js");
const User = require("../models/UserModel.js");
const Answer = require("../models/AnswerModel.js");
const { response } = require("express");

exports.createAnswer = async (req, res) => {
  try {
    const { author, content, post_id, user_id } = req.body;

    const newAnswer = new Answer({
      author,
      content,
      post_id,
      user_id,
    });

    await newAnswer.save(); // Guardamos la nueva respuesta en la colección de "answers"

    // Actualizamos el documento del usuario para añadirle la nueva respuesta
    const updatedUser = await User.findOneAndUpdate(
      { _id: user_id },
      { $push: { answer_ids: newAnswer._id } },
      { new: true }
    );

    const updatedPost = await Post.findOneAndUpdate(
      { _id: post_id },
      { $push: { answer_ids: newAnswer._id } },
      { new: true }
    );

    res.status(200).json({
      message: "La respuesta ha sido creada correctamente",
      newAnswer,
      updatedUser,
      updatedPost,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.showAnswers = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Encontrar las respuestas solo sobre ese post, usando el id
    const answers = await Answer.find({
      post_id: postId,
    });

    res.status(200).json({
      answers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Patch likes de comentarios
exports.updateLikes = async (req, res) => {
  const { action, answerId, userId } = req.body; // miramos qué quiere hacer el usuario

  if (action === "like") {
    // Necesitamos primero encontrar el comentario con ese id, para ver si el usuario ya le había dado like.
    const answer = await Answer.findOne({
      _id: answerId,
      likes: { $in: [userId] },
    });


    if (answer) {
      res.status(200).json({
        message: "Ya ha dado like a esta respuesta",
      });
    } else {
      const updatedAnswer = await Answer.findOneAndUpdate(
        { _id: answerId },
        { $inc: { numLikes: 1 }, $push: { likes: userId } },
        { new: true }
      );
      res.status(200).json({
        message: "Answer was updated successfully",
        updatedAnswer,
      });
    }
    
  } else if (action === "unlike") {
    // dislike el comentario
    const updatedAnswer = await Answer.findOneAndUpdate(
      { _id: answerId },
      { $inc: { numLikes: -1 }, $pull: { likes: userId } },
      { new: true }
    );

    res.status(200).json({
      message: "Answer was updated successfully",
      updatedAnswer,
    });
  } else {
    res.status(404).json({
      error: "An error occurred while updating",
    });
  }
};
