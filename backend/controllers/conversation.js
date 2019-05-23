'use strict';
const mongoose = require('mongoose');
const Conversation = require('../models/conversation');
const User = require('../models/user');

exports.fetchAllPreview = (req, res) => {
  const pageSize = +req.query.page_size;
  const currentPage = +req.query.page;
  let fetchedConversations;
  let conversationQuery = Conversation.find({
    userIds: { $in: [mongoose.Types.ObjectId(req.userData.userId)] },
  });

  if (pageSize && currentPage) {
    conversationQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  conversationQuery
    .then(conversations => {
      fetchedConversations = conversations;
      return Conversation.countDocuments({
        userIds: { $in: [mongoose.Types.ObjectId(req.userData.userId)] },
      });
    })
    .then(count => {
      res.status(200).json({
        message: 'Conversations fetched succesfully!',
        conversations: fetchedConversations.map(fetchedConversation => {
          const toUser = fetchedConversation.users.filter(u => u.id != req.userData.userId)[0];
          const lastMessage = fetchedConversation.messages.slice(-1)[0];
          return {
            id: fetchedConversation._id,
            to: toUser.name,
            imagePath: toUser.imagePath,
            lastMessageSender: lastMessage ? lastMessage.sender : '',
            lastMessageContent: lastMessage ? lastMessage.content : '',
          };
        }),
        maxConversations: count,
      });
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
};

exports.fetchOne = (req, res) => {
  Conversation.findById(req.params.id)
    .then(conversation => {
      if (conversation) {
        res.status(200).json({
          id: conversation._id,
          userIds: conversation.userIds,
          users: conversation.users,
          messages: conversation.messages,
        });
      } else {
        res.status(404).json({ message: 'Conversation not found!' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Fetching conversation failed!' });
    });
};

const getUsersData = async (ownId, toId) => {
  const users = await User.find({
    _id: {
      $in: [mongoose.Types.ObjectId(ownId), mongoose.Types.ObjectId(toId)],
    },
  });
  if (users && users.length === 2) {
    return users.map(u => ({ id: u._id, name: u.name, imagePath: u.imagePath }));
  } else {
    throw new Error("Can't find users!");
  }
};

exports.createConversation = (req, res) => {
  if (!req.body.toId) {
    return res.status(401).json({ message: 'Missing destination id!' });
  }
  // check for existing conversation
  Conversation.findOne({
    userIds: {
      $all: [mongoose.Types.ObjectId(req.userData.userId), mongoose.Types.ObjectId(req.body.toId)],
    },
  })
    .then(conversation => {
      if (conversation) {
        // if exists, then return
        return res.status(200).json({
          message: 'Conversation exists!',
          conversation: {
            id: conversation._id,
            userIds: conversation.userIds,
            users: conversation.users,
            messages: conversation.messages,
          },
        });
      } else {
        getUsersData(req.userData.userId, req.body.toId)
          .then(usersData => {
            // else create new conversation
            const conversation = new Conversation({
              userIds: [
                mongoose.Types.ObjectId(req.userData.userId),
                mongoose.Types.ObjectId(req.body.toId),
              ],
              users: usersData,
              messages: [],
            });
            return conversation.save();
          })
          .then(conversation => {
            res.status(201).json({
              message: 'Conversation created!',
              conversation: {
                id: conversation._id,
                userIds: conversation.userIds,
                users: conversation.users,
                messages: conversation.messages,
              },
            });
          })
          .catch(error => {
            res.status(500).json({ message: error.message });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
};

exports.deleteConversation = (req, res) => {
  Conversation.deleteOne({ _id: req.params.id })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Deletion succesfull!' });
      } else {
        res.status(401).json({ message: 'Not authorized!' });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching conversations failed!',
      });
    });
};

exports.sendMessage = (req, res) => {
  if (!req.body.toId || !req.body.message) {
    return res.status(401).json({ message: 'Destination id or message is missing!' });
  }
  // check for existing conversation
  Conversation.findOne({
    userIds: {
      $all: [mongoose.Types.ObjectId(req.userData.userId), mongoose.Types.ObjectId(req.body.toId)],
    },
  })
    .then(conversation => {
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found!' });
      } else {
        conversation.messages.push({
          sender: req.userData.name,
          senderImage: req.userData.imagePath,
          content: req.body.message,
          timestamp: Date.now(),
        });
        conversation
          .save()
          .then(saved => {
            return res.status(200).json({
              message: 'Send message was succesful!',
              conversation: {
                id: saved._id,
                userIds: saved.userIds,
                users: saved.users,
                messages: saved.messages,
              },
            });
          })
          .catch(error => {
            return res.status(500).json({ message: error.message });
          });
      }
    })
    .catch(error => {
      res.status(500).json({ message: error.message });
    });
};
