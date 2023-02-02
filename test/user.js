process.env.NODE_ENV = 'test';
process.env.PORT = 5017

import chai from 'chai';
import chaiHttp from 'chai-http';
// import User from '../models/user';
import User from '../models/user';
import app from '../';

chai.use(chaiHttp);
const expect = chai.expect;

const random = () => (Math.random() * 99999).toString()

describe('Users API', () => {
    let authToken = '';

    before((done) => {
        // log in as an admin user to get authentication token
        chai.request(app)
            .post('/auth/login')
            .send({ username: "newboy", password: "123" })
            .end((err, res) => {
                authToken = res.body.token;
                done();
            });
    });

    describe('GET /users', () => {
        it('should return a list of users', (done) => {
            chai.request(app)
                .get('/users')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('POST /users', () => {
        it('should create a new user', (done) => {
            const user = {
                username: `username-` + random(),
                fullName: `fullname-` + random(),
                password: `password` + random()
            };

            chai.request(app)
                .post('/users')
                .set('Authorization', `Basic ${authToken}`)
                .send(user)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body.username).to.equal(user.username);
                    expect(res.body.fullName).to.equal(user.fullName);
                    done();
                });
        });
    });

    describe('PUT /users/:id', () => {
        it('should update a user', async () => {

            const existingUser = await User.findOne();
            const updatedUser = { fullName: existingUser.fullName + '_' + random()}

            chai.request(app)
                .put(`/users/${existingUser._id.toString()}`)
                .set('Authorization', `Basic ${authToken}`)
                .send(updatedUser)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body.fullName).to.equal(updatedUser.fullName);
                    // done();
                });
        });
    });

    describe('DELETE /users/:id', () => {
        it('should delete a user', async () => {
            const new_user = new User({
                username: "username-" + random(),
                fullName: 'fullname-' + random(),
                password: 'password-content-' + random()
            })

            await new_user.save();
            chai.request(app)
                .delete('/users/' + new_user._id.toString())
                .set('Authorization', `Basic ${authToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(204);
                });
        });
    });
});
