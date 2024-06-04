// tests/api.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('../routes/userRoutes');
const sequelize = require('../config/database');
const User = require('../models/userModel');

const app = express();
app.use(bodyParser.json());
app.use('/api', userRoutes);

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('User API', () => {
  it('should get all users', (done) => {
    request(app)
      .get('/api/users')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('should create a new user', (done) => {
    request(app)
      .post('/api/users')
      .send({ name: 'Jane Doe' })
      .expect('Content-Type', /json/)
      .expect(201)
      .then(response => {
        expect(response.body.name).to.equal('Jane Doe');
        done();
      })
      .catch(err => done(err));
  });
});
