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
  editUser,
  getUserById,
  getUsersByName,
} = require('../controllers/user');

const router = express.Router();

router.post('/signup', extractSingleImage, emailPassValidator, signupValidator, createUser);
router.post('/login', emailPassValidator, userLogin);
router.post('/edit', checkAuth, extractSingleImage, emailPassValidator, signupValidator, editUser);
router.get('/:id', checkAuth, getUserById);

// /api/user/?page_size=2&page=1&name=Peter
router.get('/', checkAuth, getUsersByName);

module.exports = router;
