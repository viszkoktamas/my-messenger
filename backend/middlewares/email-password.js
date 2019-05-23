const { isEmail } = require('validator');

module.exports = (req, res, next) => {
  if (!isEmail(req.body.email)) {
    return res.status(401).json({ message: 'Invalid email format!' });
  }
  if (!req.body.password || !req.body.password.trim()) {
    return res.status(401).json({ message: 'Invalid password!' });
  }
  next();
};
