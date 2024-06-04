const { User } = require('./__mocks__/sequelize'); // Import the mock
const userController = require('../controllers/userController');
const httpMocks = require('node-mocks-http');

jest.mock('../../models/userModel', () => User); // Mock the user model

describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    res.json = jest.fn();
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn();
  });

  test('should get all users', async () => {
    User.findAll.mockResolvedValue([{ id: 1, name: 'John Doe' }]);

    await userController.getUsers(req, res);
    expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'John Doe' }]);
  });

  test('should add a user', async () => {
    req.body = { name: 'Jane Doe' };
    User.create.mockResolvedValue({ id: 2, name: 'Jane Doe' });

    await userController.addUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 2, name: 'Jane Doe' });
  });

  test('should handle error', async () => {
    User.findAll.mockRejectedValue(new Error('Database Error'));

    await userController.getUsers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Database Error');
  });
});
