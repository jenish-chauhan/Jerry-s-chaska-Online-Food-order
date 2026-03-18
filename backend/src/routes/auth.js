const express = require('express');
const router = express.Router();
const {
    register,
    login,
    logout,
    registerValidation,
    loginValidation
} = require('../controllers/authController');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);

module.exports = router;
