const LogsModel = require('../models/logs.model');

// eslint-disable-next-line no-console
const handlerError = console.error;

/**
 * @param {number|string} chatId
 * @param {'bot'|'web'} type
 * @param {Object} [data]
 */
const add = (chatId, type, data) => {
  return LogsModel.create({
    chatId,
    type,
    ...data,
    status: data.status.toLowerCase(),
  }).catch(handlerError);
};

const getAmount = (chatId, amount) => {
  return LogsModel.find({ chatId })
    .populate('user')
    .sort({ createdAt: -1 })
    .limit(+amount || 3)
    .then(logs => logs.sort())
    .catch(handlerError);
};

const deleteOlderThan = olderThan => {
  return LogsModel.find({ createdAt: { $lte: olderThan } })
    .deleteMany()
    .exec();
};

module.exports = {
  add,
  getAmount,
  deleteOlderThan,
};
