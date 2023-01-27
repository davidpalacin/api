const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// registrar usuario
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //Verifica si el usuario o email ya existen en la base de datos
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    //Crea un nuevo usuario
    user = new User({
      username,
      email,
      password,
    });

    //Hashea la contraseña del usuario
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //Guarda el usuario en la base de datos
    await user.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: user });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// logear usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const payload = {
      user: {
        id: user._id,
      },
    };
    jwt.sign(payload, process.env.SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res
        .status(200)
        .json({ message: "User logged in successfully", token, user });
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ message: "Error logging in user", error: err.message });
  }
};

// recibir todos los usuarios
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ message: "Users retrieved successfully", users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: err.message });
  }
};

// recibir un usuario:
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error.", error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error: ", error: err.message });
  }
};

// Seguir a un usuario:
exports.followUser = async (req, res) => {
  const { userId, followId } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { following: followId } },
      { new: true }
    );
    const followedUser = await User.findOneAndUpdate(
      { _id: followId },
      { $push: { followers: userId } },
      { new: true }
    );

    res.status(200).json({
      message: "User followed successfully",
      user,
      followedUser,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Dejar de seguir:
exports.unfollowUser = async (req, res) => {
  const { userId, unfollowId } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { following: unfollowId } },
      { new: true }
    );
    const unfollowedUser = await User.findOneAndUpdate(
      { _id: unfollowId },
      { $pull: { followers: userId } },
      { new: true }
    );

    res.status(200).json({
      message: "User unfollowed successfully",
      user,
      unfollowedUser,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};
