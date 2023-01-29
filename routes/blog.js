import { Router } from 'express'
import Blog from '../models/blog'
import authMiddleware from '../middleware/auth'

import { createBlog, updateBlog, getBlog, getBlogs, createBlogComment, getBlogComments, deleteBlog } from '../controllers/blog'
const router = Router()

router.get('/', getBlogs)

router.post('/', createBlog)


router.get('/:id', getBlog)

router.put('/:id', authMiddleware, updateBlog)


router.delete('/:id', authMiddleware, deleteBlog)

router.get('/:id/comments', getBlogComments)

router.post('/:id/comments/', createBlogComment)

export default router