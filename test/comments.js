import chai from 'chai'
// "test": "mocha --timeout 100000 -- --no-warnings --experimental-specifier-resolution=node",
// "test": "cross-env NODE_ENV=test PORT=6000 nyc mocha -- --no-warnings --experimental-specifier-resolution=node ",
import app from '..'
import Blog from '../models/blog'

import chaiHttp from 'chai-http'

chai.use(chaiHttp)

const expect = chai.expect


describe("Blog comments / Likes", () => {
    let authToken = ''

    before((done) => {
        chai.request(app)
            .post('/auth/login')
            .send({ username: "newboy", password: "123" })
            .end((err, res) => {
                authToken = res.body.token;
                done();
            });
    })



    describe("GET /blogs/:id/comments", () => {
        it('should list blog post comments', async () => {
            const blog = await Blog.findOne()
            const res = await chai.request(app)
                .get(`/blogs/${blog.id}/comments`)
            expect(res).to.have.a.status(200)
            expect(res.body).to.be.an('array');
        })
    })

    describe("POST /blogs/:id/comments", () => {
        it('should create a comment on a blog post', async () => {
            const comment = { comment: 'This is a test comment' }
            const blog = await Blog.findOne()
            const res = await chai.request(app)
                .post(`/blogs/${blog.id}/comments`)
                .set(`Authorization`, `Basic ${authToken}`)
                .send(comment)
            expect(res).to.have.a.status(201)
            expect(res.body).to.be.an('object')
            expect(res.body.comment).to.equal(comment.comment)
        })
    })

    describe("PUT /blogs/:id/comments/:commentId", () => {
        it('should update a comment', async () => {
            const blog = await Blog.findOne({ "comments.0": { "$exists": true } })
            const comment = blog.comments[0]
            const newCommnetData = { comment: "Test updated comment" }

            const res = await chai.request(app)
                .put(`/blogs/${blog.id}/comments/${comment.id.toString()}`)
                .set(`Authorization`, `Basic ${authToken}`)
                .send(newCommnetData)
            expect(res).have.a.status(200)
            expect(res.body).to.be.an('object', "Comment object")
            expect(res.body.comment).to.equal(newCommnetData.comment, "Comment updated")
        })
    })

    describe("DELETE /blogs/:id/comments/:commentId", () => {
        it('should delete a comment', async () => {
            const blog = await Blog.findOne()
            let comment = {
                id: (blog.comments[blog.comments.length - 1]?.id ?? 0) + 1,
                comment: "Test delete comment"
            }

            blog.comments.push(comment)
            await blog.save()
            const res = await chai.request(app)
                .delete(`/blogs/${blog.id}/comments/${comment.id?.toString()}`)
                .set(`Authorization`, `Basic ${authToken}`)
            expect(res).have.a.status(204)
        })
    })

    describe('POST /blogs/:id/like', () => {
        it('should increase blog likes', async () => {
            const blog = await Blog.findOne()
            const res = await chai.request(app)
                .post(`/blogs/${blog.id}/like`)
                .set('Authorization', `Basic ${authToken}`)
            expect(res).to.have.a.status(200)
            expect(res.body.likes).to.not.equal(blog.likes.length)
        })
    })
})