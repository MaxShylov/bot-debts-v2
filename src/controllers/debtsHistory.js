const isEmpty = require('lodash/isEmpty');

const db = require('../../db');
const helpers = require('../helpers');
const botWorker = require('../workers/bot');

const getAll = async globalData => {
  const {
    chatId,
    createResponse,
    fields: { amount, time },
  } = globalData;
  const history = await db.debtsHistory.getAmount(chatId, amount);

  if (!history) {
    botWorker.sendErrorServer(globalData);
    return;
  }

  const hasHistory = !isEmpty(history);
  const t = time || (hasHistory && 120);

  const response = createResponse(
    hasHistory ? 'success' : 'warning',
    helpers.responses.makeMsgDebtsHistory(history),
  );

  botWorker.sendResponse(globalData, response, t);
};

module.exports = {
  getAll,
};
