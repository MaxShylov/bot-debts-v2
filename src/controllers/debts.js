const isEmpty = require('lodash/isEmpty');
const sumBy = require('lodash/sumBy');

const db = require('../../db');
const helpers = require('../helpers');
const botWorker = require('../workers/bot');
const debtsWorker = require('../workers/debts');
const { DETAIL_TEXT } = require('../utils/constants');

/**
 * @param globalData
 * @return {Promise<void>}
 */
const add = async globalData => {
  const { chatId, fields, createResponse } = globalData;

  const options = {
    debtor: fields.creditorId,
    creditor: fields.debtorId,
    hasPaid: false,
  };
  const credits = await db.debts.getByOptions(options);
  const oldCreditsSum = sumBy(credits, 'debt') - sumBy(credits, 'paid');

  let sum = fields.debtSum;
  if (oldCreditsSum) {
    sum = await debtsWorker.deleteOldDebts(sum, credits);
  }

  const debtsHistory = await db.debtsHistory.add(chatId, 'add', fields);
  if (!debtsHistory) {
    botWorker.sendErrorServer(globalData);
    return;
  }

  if (sum) {
    const debtsAdded = await db.debts.add(chatId, { ...fields, debtSum: sum });
    if (!debtsAdded) {
      botWorker.sendErrorServer(globalData);
      return;
    }
  }

  const response = createResponse(
    'success',
    helpers.responses.makeMsgAddDebts({
      ...fields,
      paidSum: fields.debtSum - sum,
      debtSum: sum,
      oldCreditsSum,
    }),
  );

  botWorker.sendResponse(globalData, response);
};

/**
 * @param globalData
 * @return {Promise<void>}
 */
const del = async globalData => {
  const { chatId, fields, createResponse } = globalData;
  const { debtorId, creditorId, paidSum } = fields;

  const options = {
    debtor: fields.debtorId,
    creditor: fields.creditorId,
    hasPaid: false,
  };
  const debts = await db.debts.getByOptions(options);
  const sum = await debtsWorker.deleteOldDebts(paidSum, debts);

  const debtsHistory = await db.debtsHistory.add(chatId, 'del', fields);
  if (!debtsHistory) {
    botWorker.sendErrorServer(globalData);
    return;
  }

  const debtSum = sum;
  const paid = paidSum - sum;

  if (debtSum) {
    const debts = await db.debts.add(chatId, {
      ...fields,
      debtSum,
      debtorId: creditorId,
      creditorId: debtorId,
    });
    if (!debts) {
      botWorker.sendErrorServer(globalData);
      return;
    }
  }

  const response = createResponse(
    'success',
    helpers.responses.makeMsgDelDebts({
      ...fields,
      paidSum: paid,
      debtSum,
    }),
  );

  botWorker.sendResponse(globalData, response);
};

/**
 * @param globalData
 * @return {Promise<void>}
 */
const getAll = async globalData => {
  const { chatId, createResponse } = globalData;
  const debts = await db.debts.getAllNotPaidByChatId(chatId);

  if (!debts) {
    botWorker.sendErrorServer(globalData);
    return;
  }

  const dataForMsg = helpers.debts.makeData(debts);

  const response = createResponse(
    isEmpty(dataForMsg) ? 'warning' : 'success',
    helpers.responses.makeMsgGetDebts(dataForMsg),
  );

  botWorker.sendResponse(globalData, response, 120);
};

/**
 * @param globalData
 * @return {Promise<void>}
 */
const getMy = async globalData => {
  const {
    chatId,
    createResponse,
    fromId,
    fromUsername,
    fromName,
    fields,
  } = globalData;
  if (!fromId) {
    botWorker.sendErrorUserWasNotAdded(globalData, fromUsername);
    return;
  }
  const debts = await db.debts.getMyNotPaidByChatId(chatId, fromId);

  if (!debts) {
    botWorker.sendErrorServer(globalData);
    return;
  }

  const dataForMsg = helpers.debts.makeData(debts, fromName);
  const isDetail = DETAIL_TEXT.includes(fields.detail);

  const response = createResponse(
    isEmpty(dataForMsg) ? 'warning' : 'success',
    helpers.responses.makeMsgGetDebts(dataForMsg, isDetail),
  );

  botWorker.sendResponse(globalData, response, 120);
};

module.exports = {
  add,
  del,
  getAll,
  getMy,
};
