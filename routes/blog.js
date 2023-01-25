const router = require('express').Router()
const Blog = require('../models/blog')

import {
    createBlog,
    updateBlog,
    getBlog,
    getBlogs,
    createBlogComment,
    getBlogComments,
    deleteBlog
} from '../controllers/blog'

router.get('/', getBlogs)

router.post('/', createBlog)


router.get('/:id', getBlog)

router.put('/:id', updateBlog)


router.delete('/:id', deleteBlog)

router.get('/:id/comments', getBlogComments)

router.post('/:id/comments/', createBlogComment)

module.exports = router