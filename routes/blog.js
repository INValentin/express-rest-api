const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async (req, res) => {
    const blogs = await Blog.find()
    res.json(blogs)
})

router.post('/', async (req, res) => {
    try {
        const blog = new Blog({...req.body})
        await blog.save()
        res.json(blog)
    } catch (error) {
        res.status(400).json({error: error?.message || "Error" })
    }
})


router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) return res.status(404).json({error: 'Not found'})
        res.json(blog)
    } catch (error) {
        res.status(400).json({error: error?.message || "Error" })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, {...req.body})
        console.log(req.body)
        if (!blog) return res.status(404).json({error: 'Not found'})
        res.json(await Blog.findById(req.params.id))
    } catch (error) {
        res.status(400).json({error: error?.message || "Error" })
    }
})


router.delete('/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id)
        res.status(204).json({msg: "Deleted blog."})
    } catch (error) {
        res.status(400).json({error: error?.message || "Error" })
    }
})

router.get('/:id/comments', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) return res.status(404).json({error: 'Not found'})

        res.json(blog.comments)
    } catch (error) {
        res.status(400).json({error: error?.message || "Error" })
    }
})

router.post('/:id/comments/', async (req, res) => {
    const {user, comment} = req.body

    if (!user || !comment) return res.status(400).json({error: "user and comment are required"})

    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({error: 'Not found'})
    let cmt = {id: blog.comments.length, user, comment}
    blog.comments.push(cmt)

    await blog.save()
    res.json(cmt)

})

module.exports = router