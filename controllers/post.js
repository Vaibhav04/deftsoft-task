let Post = require('../models/Post');
const { validationResult } = require('express-validator');

const createPost = async (req, res) => {
  let { title, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const newPost = new Post({
      title,
      description,
      createdBy: req.user.id
    });
    await newPost.save();

    return res.status(200).json({ newPost });
  } catch (err) {
    return res.status(500).send('Server error');
  }
};
/* 
  If query params orderType set to 1 it will send latest posts
  If query params orderType set to 2 it will send posts with more number of views
  Also provides pagination so that user can get 10 post at a time

  Can also create different apis to get latest and top posts
*/
const getPosts = async (req, res, next) => {
  let skip = req.query.skip ? parseInt(req.query.skip) : 0;
  let limit = req.query.limit ? parseInt(req.query.limit) : 10;

  try {
    let posts;
    if (parseInt(req.query.orderType) === 1) {
      posts = await Post.find({}, {}, { skip, limit }).sort({
        createdAt: -1
      });
    } else if (parseInt(req.query.orderType) === 2) {
      posts = await Post.find({}, {}, { skip, limit }).sort({
        views: -1
      });
    } else {
      posts = await Post.find({}, {}, { skip, limit });
    }

    if (!posts) {
      return res.status(400).json({ errors: [{ msg: 'No posts found' }] });
    }
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).send('Server error');
  }
};

// const getNewPosts = async (req, res, next) => {
//   let skip = req.query.skip ? parseInt(req.query.skip) : 0;
//   let limit = req.query.limit ? parseInt(req.query.limit) : 10;

//   try {
//     const posts = await Post.find({}, {}, { skip, limit }).sort({
//       createdAt: -1
//     });

//     if (!posts) {
//       return res.status(400).json({ errors: [{ msg: 'No posts found' }] });
//     }
//     return res.status(200).json(posts);
//   } catch (err) {
//     return res.status(500).send('Server error');
//   }
// };

// const getTopPosts = async (req, res, next) => {
//   let skip = req.query.skip ? parseInt(req.query.skip) : 0;
//   let limit = req.query.limit ? parseInt(req.query.limit) : 10;

//   try {
//     const posts = await Post.find({}, {}, { skip, limit }).sort({
//       views: -1
//     });

//     if (!posts) {
//       return res.status(400).json({ errors: [{ msg: 'No posts found' }] });
//     }
//     return res.status(200).json(posts);
//   } catch (err) {
//     return res.status(500).send('Server error');
//   }
// };

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById({ _id: req.params.postId });

    if (!post) {
      return res.status(400).json({ errors: [{ msg: 'No posts found' }] });
    } else {
      post.views += 1;
      const newPost = await post.save();
      return res.status(200).json(newPost);
    }
  } catch (err) {
    return res.status(500).send('Server error');
  }
};

module.exports = {
  createPost,
  getPosts,
  // getNewPosts,
  // getTopPosts,
  getPost
};
