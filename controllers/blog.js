const Blog = require('../models/blog')

exports.getBlogs =  async (req, res) => {
    const blogs = await Blog.find()
    res.json(blogs)
}



exports.createBlog = async (req, res) => {
    try {
        const blog = new Blog({...req.body})
        await blog.save()
        res.json(blog)
    } catch (error) {
        res.status(400).json({error: error?.message || "Error" })
    }
}

exports.getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) return res.status(404).json({error: 'Not found'})
        res.json(blog)
    } catch (error) {
        res.status(400).json({error: error?.message || "Error" })
    }
}

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, {...req.body})
        console.log(req.body)
        if (!blog) return res.status(404).json({error: 'Not found'})
        res.json(await Blog.findById(req.params.id))
    } catch (error) {
        res.status(400).json({error: error?.message || "Error" })
    }
}

exports.deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id)
        res.status(204).json({msg: "Deleted blog."})
    } catch (error) {
        res.status(400).json({error: error?.message || "Error" })
    }
}

exports.getBlogComments = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) return res.status(404).json({error: 'Not found'})

        res.json(blog.comments)
    } catch (error) {
        res.status(400).json({error: error?.message || "Error" })
    }
}
exports.createBlogComment =  async (req, res) => {
    const {user, comment} = req.body

    if (!user || !comment) return res.status(400).json({error: "user and comment are required"})

    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({error: 'Not found'})
    let cmt = {id: blog.comments.length, user, comment}
    blog.comments.push(cmt)

    await blog.save()
    res.json(cmt)
}