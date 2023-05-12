const express = require('express')

const router = express.Router()
const {
    getAllComment,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    dislikeComment,
} = require('../controllers/comments')

router.route('/').post(createComment).get(getAllComment)

router.route('/:id').delete(deleteComment).patch(updateComment)
router.route('/like').post(likeComment)
router.route('/dislike').post(dislikeComment)

module.exports = router



