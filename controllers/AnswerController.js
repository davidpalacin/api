const Post = require("../models/PostModel.js");
const User = require("../models/UserModel.js");
const Answer = require("../models/AnswerModel.js");
const { response } = require("express");

exports.createAnswer = async (req, res) => {
  try {
    const { content, post_id, user_id } = req.body;
    const author = await User.findOne({ _id: user_id }, { new: true }).select('username');

    const newAnswer = new Answer({
      author: author.username,
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
    const isAlreadyLiked = await Answer.findOne({
      _id: answerId,
      likes: { $in: [userId] },
    });

    if (isAlreadyLiked) {
      res.status(200).json({
        message: "Ya ha dado like a esta respuesta",
      });
    } else {
      const updatedAnswer = await Answer.findOneAndUpdate(
        { _id: answerId },
        { $push: { likes: userId } },
        { new: true }
      );
      res.status(200).json({
        message: "Likes was updated successfully",
        updatedAnswer,
      });
    }
  } else if (action === "unlike") {
    // quitar like del comentario
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

// Delete a comment
exports.deleteAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    // Delete the answer
    const deletedAnswer = await Answer.findOneAndDelete({ _id: answerId });

    //Delete the answer id from the array in Posts
    const updatedPost = await Post.findOneAndUpdate(
      { _id: deletedAnswer.post_id },
      { $pull: { answer_ids: deletedAnswer._id } },
      { new: true }
    );

    const updatedUser = await User.findOneAndUpdate(
      { _id: deletedAnswer.user_id },
      { $pull: { answer_ids: deletedAnswer._id } },
      { new: true }
    );

    res.status(200).json({
      message: `El comentario ${deletedAnswer._id} ha sido eliminado`,
      updatedPost,
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

//Edit a comment
exports.editAnswer = async (req, res) => {
  // Recogemos los datos necesarios
  const { newContent, answerId } = req.body;
  // encontramos y actualizamos el comentario
  const answerEdit = await Answer.findOneAndUpdate(
    { _id: answerId },
    {
      $set: { content: newContent },
    },
    { new: true }
  );
  // Si no se ha editado ninguno, no se encuentra el comentario:
  if (!answerEdit) {
    res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }
  // Cuando se haya editado enviar respuesta satisfactoria:
  res.status(200).json({
    success: true,
    message: "comment updated successfully",
    answerEdit,
  });
};
