const router = require('express').Router()
const Blog = require('../models/blog')
const authMiddleware  = require('../middleware/auth')

const {
    createBlog,
    updateBlog,
    getBlog,
    getBlogs,
    createBlogComment,
    getBlogComments,
    deleteBlog
} = require('../controllers/blog')

router.get('/', getBlogs)

router.post('/', createBlog)


router.get('/:id', getBlog)

router.put('/:id', updateBlog)


router.delete('/:id', authMiddleware, deleteBlog)

router.get('/:id/comments', getBlogComments)

router.post('/:id/comments/', createBlogComment)

module.exports = router