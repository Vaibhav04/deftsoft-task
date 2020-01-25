let settings = require('../config'),
  { JWTPayloadHandler } = require('../utils/helper');
const bcrypt = require('bcryptjs');
let User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken'),
  randomstring = require('randomstring');
const { transporter } = require('../utils/helper');

const register = async (req, res) => {
  let { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exist' }] });
    }

    password = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password
    });
    await newUser.save();
    jwt.sign(
      JWTPayloadHandler(newUser),
      settings.secretKey,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        return res.json({ token });
      }
    );
  } catch (err) {
    return res.status(500).send('Server error');
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // throw error
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    // Else check if user credes math
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    jwt.sign(
      JWTPayloadHandler(user),
      settings.secretKey,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    return res.status(500).send('Server error');
  }
};

/** Function execution description
 * 1. User click on forgot password
 * 2. Enters his registered email
 * 3. If user is not found it returns error message
 * 4. If user is found it will send a token on registered email
 * 5. After clicking on that link user will be redirected to fronend app with the token in query params
 * 6  Here he need to enter his email and new password
 */
const forgetPassword = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let token = randomstring.generate(); 
  User.findOne({ email: req.body.email })
    .exec()
    .then(function(user) {
      if (!user) res.status(400).json({ errors: [{ msg: 'User not found' }] });
      User.findByIdAndUpdate(
        { _id: user._id },
        {
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 86400000
        },
        { upsert: true, new: true }
      )
        .exec()
        .then(function(user) {
          var data = {
            to: user.email,
            from: settings.email,
            subject: 'Password help has arrived!',
            html: `<!DOCTYPE html>
            <html>
            <head>
                <title>Forget Password Email</title>
            </head>
            
            <body>
                <div>
                    <h3>Dear ${user.email},</h3>
                    <p>You requested for a password reset, kindly use this <a href="${settings.frontendUrl}/reset?resetPasswordToken=${token}">link</a> to reset your password</p>
                    <br>
                    <p>Cheers!</p>
                </div>
            </body>
            </html>`
          };
          transporter().sendMail(data, function(err, info) {
            if (!err) {
              return res.json({ message: 'Email Sent' });
            } else {
              return res.json({ message: 'Some error occured' });
            }
          });
        })
        .catch(err => {
          return res.status(400).json({ errors: [{ msg: err }] });
        });
    })

    .catch(err => next(err));
};


/** Function execution description
 * 1. Will be executed after submit from reset password page 
 * 2. It will match the token 
 * 3. if it matches a new user password will be genrated
 * 4. Otherwise user will be requested to genrate a new token
 */
function resetPassword(req, res, next) {
  const { email, token, password } = req.body;
  User.findOne({ email })
    .exec()
    .then(function(user) {
      if (!user) res.status(400).json({ errors: [{ msg: 'User not found' }] });
      if (!user.resetPasswordToken)
        res
          .status(400)
          .json({ errors: [{ msg: 'User does not have any token' }] });
      if (user.resetPasswordToken === token) {
        bcrypt.hash(password, 12).then(newPassword => {
          user.password = newPassword;
          user.save((err, user) => {
            if (err) return res.status(400).json({ errors: [{ msg: err }] });
            return res.json({ message: 'password canged you can login now' });
          });
        });
      } else {
        return res.status(400).json({ errors: [{ msg: 'resend token' }] });
      }
    })
    .catch(err => next(err));
}

module.exports = {
  register,
  login,
  forgetPassword,
  resetPassword
};
