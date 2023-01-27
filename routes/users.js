const express = require('express');
const router = express.Router();
const UserController = require("../controllers/UserController");
const isValidToken = require('../middlewares/isValidToken.js');


/* GET users listing. */
/* Base endpoint -> '/users' */
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById); // obtener un usuario por id
router.post('/register', UserController.register); //registrar un usuario
router.post('/login', UserController.login); //loggear a un usuario
router.patch('/follow', UserController.followUser); //Seguir a un usuario
router.patch("/unfollow", UserController.unfollowUser); //Dejar de seguir a un usuario


module.exports = router;
