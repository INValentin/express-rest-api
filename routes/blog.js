import { Router } from 'express'
import Blog from '../models/blog'
import authMiddleware, {isAdmin } from '../middleware/auth'

import { createBlog, updateBlog, getBlog, getBlogs, createBlogComment, getBlogComments, deleteBlog, deleteBlogComment, updateBlogComment, likeBlog } from '../controllers/blog'
const router = Router()

router.put('/:id/comments/:commentId', authMiddleware, updateBlogComment)
router.delete('/:id/comments/:commentId', authMiddleware, deleteBlogComment)
router.get('/', getBlogs)

router.post('/', authMiddleware, isAdmin,  createBlog)







router.get('/:id', getBlog)
router.get('/:id/comments', getBlogComments)
router.post('/:id/comments', authMiddleware, createBlogComment)
router.put('/:id', authMiddleware, isAdmin, updateBlog)
router.delete('/:id', authMiddleware, isAdmin, deleteBlog)
router.post("/:id/like", authMiddleware, likeBlog)
export default router