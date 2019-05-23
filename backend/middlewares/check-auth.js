const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
      name: decodedToken.name,
      imagePath: decodedToken.imagePath,
    };
    next();
  } catch (e) {
    res.status(401).json({ message: 'You have to log in first!' });
  }
};
