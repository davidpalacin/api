const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");

router.post("/create", PostController.create); //crear un post
router.get("/:userId", PostController.getUserPost); //recibir posts de un usuario concreto
router.delete("/delete/:postId", PostController.deletePost); //eliminar un post
router.patch("/likes", PostController.updateLikes); //Actulizar los likes del post


module.exports = router;
