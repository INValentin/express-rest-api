import chai from 'chai'

import app from '..'
import Blog from '../models/blog'
import User from '../models/user'

import chaiHttp from 'chai-http'

chai.use(chaiHttp)
const random = () => (Math.random() * 99999).toString()

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
            return Blog.findOne().then(blog => {
                chai.request(app)
                    .get(`/blogs/${blog.id}/comments`)
                    .end((err, res) => {
                        expect(res).to.have.a.status(200)
                        expect(res.body).to.be.an('array');
                    })
            })
        })
    })

    describe("POST /blogs/:id/comments", () => {
        it('should create a comment on a blog post', async () => {
            const comment = { comment: 'This is a test comment' }
            return Blog.findOne().then(blog => {
                chai.request(app)
                    .post(`/blogs/${blog.id}/comments`)
                    .set(`Authorization`, `Basic ${authToken}`)
                    .send(comment)
                    .end((err, res) => {
                        expect(res).have.a.status(201)
                        expect(res.body).to.be.an('object')
                        expect(res.body.comment).to.equal(comment.comment)
                    })
            })
        })
    })

    describe("PUT /blogs/:id/comments/:commentId", () => {
        it('should update a comment', async () => {
            return Blog.findOne({ "comments.0": { "$exists": true } }).then(async blog => {
                const comment = blog.comments[0]
                const newCommnetData = { comment: "Test updated comment" }

                chai.request(app)
                    .put(`/blogs/${blog.id}/comments/${comment.id.toString()}`)
                    .set(`Authorization`, `Basic ${authToken}`)
                    .send(newCommnetData)
                    .end((err, res) => {
                        expect(res).have.a.status(200)
                        expect(res.body).to.be.an('object', "Comment object")
                        expect(res.body.comment).to.equal(newCommnetData.comment, "Comment updated")
                    })
            })
        })
    })

    describe("DELETE /blogs/:id/comments/:commentId", () => {
        it('should delete a comment', async () => {
            return Blog.findOne().then(async blog => {
                let comment = {
                    id: (blog.comments[blog.comments.length - 1]?.id ?? 0) + 1,
                    comment: "Test delete comment"
                }

                blog.comments.push(comment)

                await blog.save()

                chai.request(app)
                    .delete(`/blogs/${blog.id}/comments/${comment.id?.toString()}`)
                    .set(`Authorization`, `Basic ${authToken}`)
                    .end((err, res) => {
                        expect(res).have.a.status(204)
                    })
            })
        })
    })

    describe('POST /blogs/:id/like', () => {
        it('should increase blog likes', async () => {
            return Blog.findOne().then(blog => {
                chai.request(app)
                    .post(`/blogs/${blog.id}/like`)
                    .set('Authorization', `Basic ${authToken}`)
                    .end((err, res) => {
                        expect(res).to.have.a.status(200)
                        expect(res.body.likes).to.not.equal(blog.likes.length)
                    })
            })
        })
    })
})