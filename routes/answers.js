const express = require("express");
const router = express.Router();
const AnswerController = require("../controllers/AnswerController");

router.post("/create", AnswerController.createAnswer); //crear un post

module.exports = router;
