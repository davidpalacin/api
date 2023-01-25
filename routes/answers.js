const express = require("express");
const router = express.Router();
const AnswerController = require("../controllers/AnswerController");

router.post("/create", AnswerController.createAnswer); //crear un post
router.get("/:postId", AnswerController.showAnswers); // mostrar las respuestas a un post
router.patch("/likes", AnswerController.updateLikes); // hacer like o unlike un comentario
router.delete("/delete/:id", AnswerController.deleteAnswer); // eliminar la respuesta 

module.exports = router;
