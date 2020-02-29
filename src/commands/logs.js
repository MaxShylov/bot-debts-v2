const botWorker = require('../workers/bot');
const logsController = require('../controllers/logs');
const commands = require('../utils/commands');
const queries = require('../utils/queries');
const response = require('../middleware/response');

const { amount, time } = queries;

module.exports = () => {
  botWorker.onText(
    commands.getLogs,
    response(logsController.getAll, [amount, time]),
  );
};
