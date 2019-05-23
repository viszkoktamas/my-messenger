const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
  userIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  },
  users: {
    type: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        imagePath: { type: String, required: true },
      },
    ],
    required: true,
  },
  messages: {
    type: [
      {
        sender: { type: String, required: true },
        senderImage: { type: String, required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, required: true },
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model('Conversation', conversationSchema);
