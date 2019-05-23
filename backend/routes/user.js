const express = require('express');

const {
  extractSingleImage,
  emailPassValidator,
  signupValidator,
  checkAuth,
} = require('../middlewares');
const {
  createUser,
  userLogin,
  getUserById,
  getUsersByName,
} = require('../controllers/user');

const router = express.Router();

router.post('/signup', extractSingleImage, emailPassValidator, signupValidator, createUser);
router.post('/login', emailPassValidator, userLogin);

// /api/user/?page_size=2&page=1&name=Peter
router.get('/', checkAuth, getUsersByName);

router.get('/:id', checkAuth, getUserById);

module.exports = router;
