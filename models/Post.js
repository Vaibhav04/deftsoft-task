const mongoose = require('mongoose'),
      ObjectId = mongoose.Schema.Types.ObjectId;

let postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);
