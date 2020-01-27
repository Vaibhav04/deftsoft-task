const router = require('express').Router(),
  validators = require('../validators/post'),
  controller = require('../controllers/post'),
  helper = require('../utils/helper');

/***
 * GET /posts
 * @requires: {HttpHeader} token: <jwt>
 * @description : Get all the posts
 * @returns: {Status} 200|401|500
 */

router.get('/', [helper.authenticateUser, controller.getPosts]);

/***
 * GET /posts/new
 * @requires: {HttpHeader} token: <jwt>
 * @description : Return latest posts
 * @returns: {Status} 200|401|500
 */

// router.get('/new', [helper.authenticateUser, controller.getNewPosts]);

/***
 * GET /posts/top
 * @requires: {HttpHeader} token: <jwt>
 * @description : Return top posts based on views
 * @returns: {Status} 200|401|500
 */

// router.get('/top', [helper.authenticateUser, controller.getTopPosts]);

/***
 * GET /posts/:postId
 * @requires: {HttpHeader} token: <jwt>
 * @description : Get post data with the provided id
 * @returns: {Status} 200|401|500
 */
router.get('/:postId', [helper.authenticateUser, controller.getPost]);

/***
 * POST /posts/create
 * @requires: {HttpHeader} token: <jwt>
 * @description : Create a new post
 * @returns: {Status} 200|401|500
 */
router.post('/create', [
  helper.authenticateUser,
  validators.validateCreatePost,
  controller.createPost
]);

module.exports = router;
