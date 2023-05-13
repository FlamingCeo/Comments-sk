const Comment = require('../models/Comment')
const Like = require('../models/Like')
const DisLike = require('../models/Dislike')


const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError,ForbiddenError } = require('../errors')

//Fetch All comments from collection.
const getAllComment = async (req, res) => {
    // 1 is descending, -1 is ascending
    const { page = 1,
            limit = 5 ,
            filter = "createdAt",
            status = 1
        } = req.query;
    const comments = await Comment.find({})
                                 .sort({
                                  [filter]:parseInt(status)}
                                 )
                                 .limit(limit * 1)
                                 .skip((page - 1) * limit);

    const totalPost = await Comment.countDocuments();


    res.status(StatusCodes.OK).json({ comments,
         count: comments.length,
         totalPages: Math.ceil(totalPost / limit),
         currentPage: page
         })
}

//Fetch Single comment from collection.
const getSingleComment = async (req, res) => {
  // 1 is descending, -1 is ascending
  const {
    user: { userId },
    params: { id: commentId },
  } = req

  const comment = await Comment.findById(commentId)
      
  res.status(StatusCodes.OK).json({ comment })
}

//Creating comment to collection.
const createComment = async (req, res) => {
    req.body.userId = req.user.userId
    const comment = await Comment.create(req.body)
    res.status(StatusCodes.CREATED).json({ comment })
}

//Updating comment from collection. Only User can update it own comment
const updateComment = async (req, res) => {
    const {
        body: { comment: comments },
        user: { userId },
        params: { id: commentId },
      } = req
      if (!comments ) {
        throw new BadRequestError('Comment fields cannot be empty')
      }
      const comment = await Comment.findOneAndUpdate(
        { _id: commentId,userId: userId },
        req.body,
        { new: true, runValidators: true }
      )
      if (!comment) {
        throw new ForbiddenError(`Sorry, you are not allowed to update this comment`)
      }
      res.status(StatusCodes.OK).json({ comment })
}

//Deleting comment from collection. Only User can delete it own comment
const deleteComment = async (req, res) => {
    const {
        body: { comment },
        user: { userId },
        params: { id: commentId },
      } = req
    
      const comments = await Comment.findOneAndDelete(
        { _id: commentId ,userId: userId}
      )
      if (!comments) {
        throw new ForbiddenError(`Sorry, you are not allowed to delete this comment`)
      }
      res.status(StatusCodes.OK).send()
}

//This is for like button call
const likeComment = async (req, res) => {
    const userId = req.user.userId;
    const commentId = req.body.commentId;
    const dislike = await DisLike.findOne({commentId: commentId,userId: userId })
    const like = await Like.findOne({commentId: commentId,userId: userId })

    if(!dislike && !like){
        const like = await Like.create({commentId: commentId,userId: userId})
         await Comment.findByIdAndUpdate( commentId,
        {$inc : {likes : 1}},
        { new: true, runValidators: true },
        )
      return  res.status(StatusCodes.CREATED).send();
    }

    throw new ForbiddenError('You already liked/disliked it')


}

//This is for dislike button call
const dislikeComment = async (req, res) => {
    const userId = req.user.userId;
    const commentId = req.body.commentId;
    const dislike = await DisLike.findOne({commentId: commentId,userId: userId })
    const like = await Like.findOne({commentId: commentId,userId: userId })

    if(!dislike && !like){
        const like = await DisLike.create({commentId: commentId,userId: userId})
        await Comment.findByIdAndUpdate( commentId,
            {$inc : {dislikes : 1}},
            { new: true, runValidators: true },
            )
      return  res.status(StatusCodes.CREATED).send();
    }

    throw new ForbiddenError('You already liked/disliked it')
}
  

module.exports = {
    getAllComment,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
    getSingleComment

}
