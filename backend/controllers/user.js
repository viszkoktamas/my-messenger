const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res) => {
  const url = req.protocol + '://' + req.get('host');
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      imagePath: url + '/images/' + req.file.filename,
      name: req.body.name,
      city: req.body.city,
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: 'User created!',
          result,
        });
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  });
};

exports.userLogin = (req, res) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Invalid authentication credentials!',
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Invalid authentication credentials!',
        });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          name: fetchedUser.name,
          imagePath: fetchedUser.imagePath,
        },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );
      res.status(200).json({ token, expiresIn: 3600, userId: fetchedUser._id });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Invalid authentication credentials!',
      });
    });
};

exports.getUsersByName = (req, res) => {
  const pageSize = +req.query.page_size;
  const currentPage = +req.query.page;
  const name = req.query.name;
  let fetchedUsers;
  let userQuery = User.find({
    _id: { $ne: req.userData.userId },
    name: { $regex: name, $options: 'i' },
  });

  if (pageSize && currentPage) {
    userQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  userQuery
    .then(users => {
      fetchedUsers = users;
      return User.countDocuments({
        _id: { $ne: req.userData.userId },
        name: { $regex: name, $options: 'i' },
      });
    })
    .then(count => {
      res.status(200).json({
        message: 'Users fetched succesfully!',
        users: fetchedUsers.map(fetchedUser => ({
          id: fetchedUser._id,
          name: fetchedUser.name,
          city: fetchedUser.city,
          imagePath: fetchedUser.imagePath,
        })),
        maxUsers: count,
      });
    })
    .catch(error => {
      res.status(500).json({ message: 'Fetching users failed!' });
    });
};

exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json({
          id: user._id,
          name: user.name,
          city: user.city,
          imagePath: user.imagePath,
        });
      } else {
        res.status(404).json({ message: 'User not found!' });
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Fetching user failed!' });
    });
};
