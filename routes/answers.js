const express = require("express");
const router = express.Router();
const AnswerController = require("../controllers/AnswerController");

router.post("/create", AnswerController.createAnswer); //crear un post
router.get("/:postId", AnswerController.showAnswers); // mostrar las respuestas a un post

module.exports = router;
