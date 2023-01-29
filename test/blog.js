process.env.NODE_ENV = 'test';
process.env.PORT = 5017

import chai from 'chai';
import chaiHttp from 'chai-http';
import User from '../models/user';
import Blog from '../models/blog';
import app from '../';

chai.use(chaiHttp);
const expect = chai.expect;

const random = () => (Math.random() * 99999).toString()

describe('Blogs API', () => {
    let authToken = '';

    before((done) => {
        // log in as an admin user to get authentication token
        const user = new User({ username: random(), password: random(), fullName: random(), userType: 'admin' })
        user.save().then(result => {
            chai.request(app)
                .post('/login')
                .send({ username: user.username, password: user.password })
                .end((err, res) => {
                    authToken = res.body.token;
                    console.log({authToken});
                    done();
                });
        })
    });

    describe('GET /blogs', () => {
        it('should return a list of blogs', (done) => {
            chai.request(app)
                .get('/blogs')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('POST /blogs', () => {
        it('should create a new blog', (done) => {
            const blog = {
                author: 'John Doe',
                title: 'Test Blog',
                content: 'This is a test blog'
            };

            chai.request(app)
                .post('/blogs')
                .set('Authorization', `Basic ${authToken}`)
                .send(blog)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body.author).to.equal(blog.author);
                    expect(res.body.title).to.equal(blog.title);
                    expect(res.body.content).to.equal(blog.content);
                    done();
                });
        });
    });

    describe('PUT /blogs/:id', () => {
        it('should update a blog', async () => {
            const new_blog = new Blog({
                title: "test-" + random(),
                author: 'test-' + random(),
                content: 'test-content-' + random()
            })

            await new_blog.save()

            const updatedBlog = {
                author: 'Jane Doe',
                title: 'Updated Test Blog',
                content: 'This is an updated test blog'
            };

            chai.request(app)
                .put('/blogs/' + new_blog._id.toString())
                .set('Authorization', `Basic ${authToken}`)
                .send(updatedBlog)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.author).to.equal(updatedBlog.author);
                    expect(res.body.title).to.equal(updatedBlog.title);
                    expect(res.body.content).to.equal(updatedBlog.content);
                    // done();
                });
        });
    });

    describe('DELETE /blogs/:id', () => {
        it('should delete a blog', async () => {
            const new_blog = new Blog({
                title: "delete-test-" + random(),
                author: 'delete-test-' + random(),
                content: 'delete-test-content-' + random()
            })
            await new_blog.save()

            chai.request(app)
                .delete('/blogs/' + new_blog._id.toString())
                .set('Authorization', `Basic ${authToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(204);
                    // done();
                });
        });
    });
});
