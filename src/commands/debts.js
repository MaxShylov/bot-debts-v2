const botWorker = require('../workers/bot');
const debtsController = require('../controllers/debts');
const commands = require('../utils/commands');
const queries = require('../utils/queries');
const response = require('../middleware/response');

const {
  debtorUsername,
  creditorUsername,
  debtSum,
  paidSum,
  comment,
  time,
  detail,
} = queries;

module.exports = () => {
  botWorker.onText(
    commands.add,
    response(debtsController.add, [
      debtorUsername,
      creditorUsername,
      debtSum,
      comment,
    ]),
  );
  botWorker.onText(
    commands.del,
    response(debtsController.del, [debtorUsername, creditorUsername, paidSum]),
  );
  botWorker.onText(
    commands.getDebts,
    response(debtsController.getAll, [time])
  );
  botWorker.onText(
    commands.getMyDebts,
    response(debtsController.getMy, [detail]),
  );
};
