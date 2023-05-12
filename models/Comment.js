const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Please provide comment'],
      maxlength: 50,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      //ref: 'User',
      //required: [true, 'Please provide user'],
    },
    likes: {
      type: Number,
      default: 0
    },
    dislikes: {
      type: Number,
      default: 0

    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Comment', CommentSchema)
