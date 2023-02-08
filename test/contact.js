// process.env.NODE_ENV = 'test';
// process.env.PORT = 5017
import mongoose from 'mongoose';
import chai from 'chai';
import chaiHttp from 'chai-http';
// import Contact from '../models/contact';
import Contact from '../models/contact';
import app from '../';

chai.use(chaiHttp);
const expect = chai.expect;

const random = () => (Math.random() * 99999).toString()

describe('Contacts API', () => {
    let authToken = '';

    before((done) => {
        // log in as an admin contact to get authentication token
        chai.request(app)
            .post('/auth/login')
            .send({ contactname: "newboy", password: "123" })
            .end((err, res) => {
                authToken = res.body.token;
                done();
            });
    });


    describe('GET /contacts', () => {
        it('should return a list of contacts', (done) => {
            chai.request(app)
                .get('/contacts')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('POST /contacts', () => {
        it('should create a new contact', (done) => {
            const contact = {
                message: `message-` + random(),
                fullName: `fullname-` + random(),
                email: `email@test.test`
            };

            chai.request(app)
                .post('/contacts')
                .set('Authorization', `Basic ${authToken}`)
                .send(contact)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body.email).to.equal(contact.email);
                    expect(res.body.message).to.equal(contact.message);
                    expect(res.body.fullName).to.equal(contact.fullName);
                    done();
                });
        });
    });

    describe('GET /contacts/:id', () => {
        it('should GET a single contact', async () => {
            const existingContact = await Contact.findOne();
            const res = await chai.request(app)
                .get(`/contacts/${existingContact._id.toString()}`)
            expect(res).to.have.a.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.fullName).to.equal(existingContact.fullName);
            expect(res.body.message).to.equal(existingContact.message);
            expect(res.body.email).to.equal(existingContact.email);
        });
    });

    describe('PUT /contacts/:id', () => {
        it('should update a contact', async () => {

            const existingContact = await Contact.findOne();
            const updatedContact = { message: existingContact.message + '_' + random() }

            const res = await chai.request(app)
                .put(`/contacts/${existingContact._id.toString()}`)
                .set('Authorization', `Basic ${authToken}`)
                .send(updatedContact)
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body.message).to.equal(updatedContact.message);
        });
    });

    describe('DELETE /contacts/:id', () => {
        it('should delete a contact', async () => {
            const new_contact = new Contact({
                message: "message-" + random(),
                fullName: 'fullname-' + random(),
                email: 'email@delete.test'
            })

            await new_contact.save();
            const res = await chai.request(app)
                .delete('/contacts/' + new_contact._id.toString())
                .set('Authorization', `Basic ${authToken}`)
            expect(res).to.have.status(204);
        });
    });
});
