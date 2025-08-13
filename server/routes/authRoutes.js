const express = require('express');
const router = express.Router();
const { register, login, deleteUser, searchUser } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.delete('/delete/:userId', deleteUser);
router.get('/search', searchUser);

module.exports = router;