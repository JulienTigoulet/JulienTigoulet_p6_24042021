// Authentification --> jsonwebtoken

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, '994T0Z0GTCtfxXg0y8Qfgtrmi1iu0JCc1wH8b6QmeBzBYyHUcBlqOYwV6stDrMXb8SlmqFcqesRJ6Zr7yuUC4xrA4DAxFocvpxRR6syiEdFaclAOKQyinqAM');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};