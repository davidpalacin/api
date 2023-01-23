const express = require("express");
const router = express.Router();
const AnswerController = require("../controllers/AnswerController");

router.post("/create", AnswerController.createAnswer); //crear un post
router.get("/:postId", AnswerController.showAnswers);

module.exports = router;
