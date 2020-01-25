const router = require('express').Router(),
  validators = require('../validators/auth'),
  controller = require('../controllers/auth');



/***
 * POST /auth/register
 * @param: {String} email
 * @param: {String} password
 * @returns: {JSON} signed JSONWebToken with user._id in jwt_payload
 */
router.post('/register', [
  validators.validateRegisterInput,
  controller.register
]);

/***
 * GET /auth/login
 * @param: {String} email
 * @param: {String} password
 * @returns: {JSON} signed JSONWebToken with user._id in jwt_payload
 */
router.get('/login', [validators.validateLoginInput, controller.login]);
/***
 * PATCH /auth/forget-password
 * @param: {String} email
 * @returns: send a token on registered email
 */
router.patch('/forget-password', [
  validators.validateForgetPasswordInput,
  controller.forgetPassword
]);

/***
 * PATCH /auth/forget-password
 * @param: {String} email
 * @param: {String} token
 * @param: {String} newPassword
 * @returns: send a confirmation message if password has been changed or need to genrate a new token
 */
router.patch('/reset-password', [
  validators.validateResetPasswordInput,
  controller.resetPassword
]);

module.exports = router;
