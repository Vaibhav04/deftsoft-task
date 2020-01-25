const { check } = require('express-validator');

const validateCreatePost = [
  check('title', 'Title is required')
    .not()
    .isEmpty(),
  check('description', 'Description is required')
    .not()
    .isEmpty()
];

module.exports = {
  validateCreatePost
};
