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

exports.getUserPost = async (req, res) => {
  try {
    const posts = await Post.find({ user_id: req.params.userId });
    if (posts.length == 0) {
      return res.status(200).json({ message: "Aún no tienes ningún post, ¡anímate a compartir algo!" });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
