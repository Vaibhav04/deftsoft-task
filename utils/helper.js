const jwt = require('jsonwebtoken'),
      config = require('../config'),
      nodemailer = require('nodemailer'),
      settings = require('../config')

const JWTPayloadHandler = user => {
  return {
    id: user.id,
    email: user.email, 
    iat: Math.floor(new Date() / 1000)
  };
};

const authenticateUser = async (req, res, next) => {
  const token = req.header('token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  // Verify token
  try {
    await jwt.verify(token, config.secretKey, (error, decoded) => {
      if (error) {
        return res.status(401).json({ msg: 'Not a valid token' });
      } else {
        req.user = decoded;
        next();
      }
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

const  transporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: settings.email,
      pass: settings.pass
    }
  });
}

module.exports = {
  JWTPayloadHandler,
  authenticateUser,
  transporter
};
