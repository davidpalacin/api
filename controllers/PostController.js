const Post = require("../models/PostModel.js");
const User = require("../models/UserModel.js");

exports.create = async (req, res) => {
  const { title, content, image, user_id } = req.body;

  const post = new Post({
    title,
    content,
    image,
    user_id,
  });
  await post.save();

  // Además de crear el post, es necesario añadir el id del post a la colección de usuarios
  const updatedUser = await User.findOneAndUpdate(
    { _id: post.user_id },
    { $push: { post_ids: post._id } },
    { new: true }
  );

  res.json({
    message: "post created successfully",
    post,
    updatedUser,
  });
};

// recibir los posts de un usuario
exports.getUserPost = async (req, res) => {
  try {
    const posts = await Post.find({ user_id: req.params.userId });
    if (posts.length == 0) {
      return res
        .status(200)
        .json({
          message: "Aún no tienes ningún post, ¡anímate a compartir algo!",
        });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

// Permitir al usuario eliminar un post
exports.deletePost = async (req, res) => {
  try {
    const postToDelete = await Post.findById(req.params.postId);

    await Post.deleteOne({ //Lo eliminamos de la colección de posts
      _id: postToDelete._id,
    });

    const updatedUser = await User.findOneAndUpdate(
      { _id: postToDelete.user_id },
      { $pull: { post_ids: postToDelete._id } },
      { new: true }
    );

    res.status(200).json({
      message: `El post ${postToDelete._id} ha sido eliminado del usuario ${postToDelete.user_id}`,
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
