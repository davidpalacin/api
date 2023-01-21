const express = require('express');
const router = express.Router();
const UserController = require("../controllers/UserController");


/* GET users listing. */
/* Base endpoint -> '/users' */
router.get('/', UserController.getUsers);
router.post('/add', UserController.createUser);

module.exports = router;
