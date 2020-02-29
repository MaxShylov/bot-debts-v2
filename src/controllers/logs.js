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
  const logs = await db.logs.getAmount(chatId, amount);

  if (!logs) {
    botWorker.sendErrorServer(globalData);
    return;
  }

  const hasLogs = !isEmpty(logs);
  const t = time || (hasLogs && 120);

  const response = createResponse(
    hasLogs ? 'success' : 'warning',
    helpers.responses.makeMsgLogs(logs),
  );

  botWorker.sendResponse(globalData, response, t);
};

module.exports = {
  getAll,
};
