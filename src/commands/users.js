const botWorker = require('../workers/bot');
const usersController = require('../controllers/users');
const commands = require('../utils/commands');
const queries = require('../utils/queries');
const response = require('../middleware/response');

const {
  name,
  newName,
  username,
  oldUsername,
  newUsername,
  userId,
  time,
} = queries;

module.exports = () => {
  // Add User
  botWorker.onText(
    commands.addUser,
    response(usersController.add, [name, username]),
  );
  // Get User ID
  botWorker.onText(
    commands.getUserId,
    response(usersController.getId, [oldUsername]),
  );
  // Update User
  botWorker.onText(
    commands.updateUser,
    response(usersController.update, [userId, newName, newUsername]),
  );
  // Get All User
  botWorker.onText(commands.getUsers, response(usersController.getAll, [time]));
};
