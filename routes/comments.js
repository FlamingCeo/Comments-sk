const express = require('express')

const router = express.Router()
const {
    getAllComment,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
    getSingleComment
} = require('../controllers/comments')

router.route('/').post(createComment).get(getAllComment)

router.route('/:id').get(getSingleComment).delete(deleteComment).patch(updateComment)
router.route('/like').post(likeComment)
router.route('/dislike').post(dislikeComment)

module.exports = router



