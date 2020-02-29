const DebtsModel = require('../models/debts.model');

// eslint-disable-next-line no-console
const handlerError = console.error;

/**
 * Add debt to database
 *
 * @param {number|string} chatId
 * @param {ObjectId} debtorId
 * @param {Schema.ObjectId} creditorId
 * @param {number} debtSum
 * @param {string} [comment]
 * @return {Schema.ObjectId} - ID of debt
 */
const add = (chatId, { debtorId, creditorId, debtSum, comment }) => {
  return DebtsModel.create({
    chatId,
    debtor: debtorId,
    creditor: creditorId,
    debt: debtSum,
    comment,
  })
    .then(debt => debt._id)
    .catch(handlerError);
};

const updateOneById = (id, newFields) => {
  return DebtsModel.findByIdAndUpdate(id, newFields).catch(handlerError);
};

/**
 * @param {Object} options
 * @return {*}
 */
const getByOptions = options => {
  return DebtsModel.find(options)
    .populate('debtor', 'name')
    .populate('creditor', 'name')
    .catch(handlerError);
};
/**
 * @param {string|number} chatId
 * @return {*}
 */
const getAllNotPaidByChatId = chatId => {
  return getByOptions({ chatId, hasPaid: false }).catch(handlerError);
};

/**
 * @param {string|number} chatId
 * @param {Schema.ObjectId} userId
 * @return {*}
 */
const getMyNotPaidByChatId = (chatId, userId) => {
  return getByOptions({
    chatId,
    hasPaid: false,
    $or: [{ debtor: userId }, { creditor: userId }],
  }).catch(handlerError);
};

module.exports = {
  add,
  getByOptions,
  updateOneById,
  getAllNotPaidByChatId,
  getMyNotPaidByChatId,
};
