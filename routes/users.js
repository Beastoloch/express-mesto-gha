const router = require('express').Router();
const { getUsersById, getUsers, createUser, updateUser, updateUserAvatar} = require('../controllers/users');
const User = require("../models/users");

router.get('/', getUsers);
router.get('/:userId', getUsersById);
router.post('/', createUser);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
