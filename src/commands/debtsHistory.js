const debtsHistoryController = require('../controllers/debtsHistory');
const botWorker = require('../workers/bot');
const commands = require('../utils/commands');
const queries = require('../utils/queries');
const response = require('../middleware/response');

const { amount, time } = queries;

module.exports = () => {
  botWorker.onText(
    commands.getDebtsHistory,
    response(debtsHistoryController.getAll, [amount, time]),
  );
};
