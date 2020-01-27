const { check } = require('express-validator');

const validateRegisterInput = [
  check('email', 'Email is required')
    .not()
    .isEmpty(),
  check('email', 'Email is not valid').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({
    min: 6
  })
];

const validateLoginInput = [
  check('email', 'Email is required')
    .not()
    .isEmpty(),
  check('email', 'Email is not valid').isEmail(),
  check('password', 'Password is required')
    .not()
    .isEmpty()
];

const validateForgetPasswordInput = [
  check('email', 'Email is required')
    .not()
    .isEmpty(),
  check('email', 'Email is not valid').isEmail()
];

const validateResetPasswordInput = [
  check('email', 'Email is required')
    .not()
    .isEmpty(),
  check('email', 'Email is not valid').isEmail(),
  check('token', 'Token is required')
    .not()
    .isEmpty(),
  check('password', 'Password is required')
    .not()
    .isEmpty()
];
module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateForgetPasswordInput,
  validateResetPasswordInput
};
