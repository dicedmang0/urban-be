const User = require('../models/userModel'); // This import will be mocked
const authController = require('../controllers/authController');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

jest.mock('../models/userModel');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    res.json = jest.fn();
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn();
  });

  test('should register a user and return a token', async () => {
    req.body = { name: 'Jane Doe', password: 'password' };
    User.create.mockResolvedValue({ id: 1, name: 'Jane Doe' });
    bcrypt.hash.mockResolvedValue('hashedpassword');
    jwt.sign.mockReturnValue('fake-jwt-token');

    await authController.register(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ auth: true, token: 'fake-jwt-token' });
  });

  test('should login a user and return a token', async () => {
    req.body = { name: 'Jane Doe', password: 'password' };
    User.findOne.mockResolvedValue({ id: 1, name: 'Jane Doe', password: 'hashedpassword' });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('fake-jwt-token');

    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ auth: true, token: 'fake-jwt-token' });
  });

  test('should fail login with invalid password', async () => {
    req.body = { name: 'Jane Doe', password: 'password' };
    User.findOne.mockResolvedValue({ id: 1, name: 'Jane Doe', password: 'hashedpassword' });
    bcrypt.compare.mockResolvedValue(false);

    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Invalid password');
  });

  test('should fail login with user not found', async () => {
    req.body = { name: 'Jane Doe', password: 'password' };
    User.findOne.mockResolvedValue(null);

    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('User not found');
  });

  test('should return validation errors for register', async () => {
    req.body = { name: '', password: 'short' };

    const validatorMiddleware = require('../middlewares/validatorUsers').validateRegister;
    await validatorMiddleware[2](req, res, () => {});

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        { msg: 'Name must be at least 3 characters long', param: 'name', location: 'body' },
        { msg: 'Password must be at least 6 characters long', param: 'password', location: 'body' }
      ]
    });
  });
});
