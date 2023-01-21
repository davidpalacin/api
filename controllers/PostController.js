const Post = require('../models/PostModel.js');
const User = require('../models/UserModel.js');

exports.create = async (req, res) => {
  const { title, content, image, user_id} = req.body;
  
  const post = new Post({
    title,
    content,
    image,
    user_id
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
    updatedUser
  });
}