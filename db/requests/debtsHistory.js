const DebtsHistoryModel = require('../models/debtsHistory.model');

// eslint-disable-next-line no-console
const handlerError = console.error;

/**
 * @param {number|string} chatId
 * @param {'add'|'del'} type
 * @param {Schema.ObjectId} debtorId
 * @param {Schema.ObjectId} creditorId
 * @param {number} debtSum
 * @param {number} paidSum
 * @param {string} [comment]
 */
const add = (
  chatId,
  type,
  { debtorId, creditorId, debtSum, paidSum, comment },
) => {
  return DebtsHistoryModel.create({
    chatId,
    type,
    debtor: debtorId,
    creditor: creditorId,
    sum: debtSum || paidSum,
    comment,
  }).catch(handlerError);
};

const getAmount = (chatId, amount) => {
  return DebtsHistoryModel.find({ chatId })
    .populate('debtor', 'name -_id')
    .populate('creditor', 'name -_id')
    .sort({ createdAt: -1 })
    .limit(+amount || 3)
    .then(logs => logs.sort())
    .catch(handlerError);
};

module.exports = {
  add,
  getAmount,
};
