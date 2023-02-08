import Blog from '../models/blog.js'

export async function getBlogs(req, res) {
    const blogs = await Blog.find().sort({ _id: -1 }).limit(15)
    res.json(blogs)
}

export async function createBlog(req, res) {
    try {
        const blog = new Blog({ ...req.body })
        await blog.save()
        res.status(201).json(blog)
    } catch (error) {
        res.status(400).json({ error: error?.message || "Something went wrong!" })
    }
}

export async function getBlog(req, res) {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) return res.status(404).json({ error: 'Blog not found' })
        res.json(blog)
    } catch (error) {
        res.status(400).json({ error: error?.message || "Something went wrong!" })
    }
}

export async function updateBlog(req, res) {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, { ...req.body })
        if (!blog) return res.status(404).json({ error: 'Blog not found' })
        res.json(await Blog.findById(req.params.id))
    } catch (error) {
        res.status(400).json({ error: error?.message || "Something went wrong!" })
    }
}

export async function deleteBlog(req, res) {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id)
        if (!blog) return res.status(404).json({ error: 'Blog not found' })
        res.status(204).json('')
    } catch (error) {
        res.status(400).json({ error: error?.message || "Something went wrong!" })
    }
}

export async function getBlogComments(req, res) {
    try {
        const blog = await Blog.findById(req.params.id)
        if (!blog) return res.status(404).json({ error: 'Blog not found' })

        res.json(blog.comments)
    } catch (error) {
        res.status(400).json({ error: error?.message || "Something went wrong!" })
    }
}


export async function createBlogComment(req, res) {
    const { user, comment } = req.body
    if (!comment) return res.status(400).json({ error: "comment is required" })

    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ error: 'Blog not found' })
    let cmt = { id: (blog.comments[blog.comments.length - 1]?.id ?? 0) + 1, user: req.user.username, comment }
    blog.comments.push(cmt)

    await blog.save()
    res.status(201).json(cmt)
}

export async function updateBlogComment(req, res) {
    const { user, comment } = req.body

    if (!user && !comment) return res.status(400).json({ error: "No valid fields to update" })

    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ error: 'Blog not found' })
    let cmtIdx = blog.comments.findIndex(cm => cm.id === parseInt(req.params.commentId))
    if (cmtIdx === -1) return res.status(404).json({ error: "Comment not found" })
    let cmt = blog.comments[cmtIdx]
    blog.comments[cmtIdx] = { id: cmt.id, user: cmt.user, comment: comment ?? cmt.comment }

    await blog.save()
    res.status(200).json(blog.comments[cmtIdx])
}

export async function deleteBlogComment(req, res) {
    const blog = await Blog.findById(req.params.id)
    if (!blog) return res.status(404).json({ error: 'Blog not found' })
    let cmtIdx = blog.comments.findIndex(cm => cm.id === parseInt(req.params.commentId))
    if (cmtIdx === -1) return res.status(404).json({ error: "Comment not found" })
    blog.comments.splice(cmtIdx, 1)

    await blog.save()
    res.status(204).json('')
}

export async function likeBlog(req, res) {
    const blog = await Blog.findById(req.params.id)//.populate('likes.*')
    if (!blog) return res.status(404).json({ error: 'Blog not found' })
    // Already liked
    const likeIdx = blog.likes.findIndex(_id => _id = req.user._id)

    if (likeIdx === -1) {
        blog.likes.push(req.user)
    } else {
        blog.likes.splice(likeIdx, 1)
    }

    await blog.save()
    res.json({ likes: (await Blog.findById(req.params.id)).likes.length })
}