const express = require('express');

const { checkAuth } = require('../middlewares');
const { sendMessage, fetchAllPreview, fetchOne, createConversation, deleteConversation } = require('../controllers/conversation');

const router = express.Router();

router.post('/', checkAuth, createConversation);
router.put('/', checkAuth, sendMessage);
router.get('/', checkAuth, fetchAllPreview);
router.get('/:id/', checkAuth, fetchOne);
router.delete('/:id', checkAuth, deleteConversation);

module.exports = router;
