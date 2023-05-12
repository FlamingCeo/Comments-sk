const mongoose = require('mongoose')

const LikeSchema = new mongoose.Schema(
  {
    commentId: {
      type: mongoose.Types.ObjectId,
      ref: 'Comment',
      required: [true, 'Please provide comment id'],
      maxlength: 50,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Like', LikeSchema)
