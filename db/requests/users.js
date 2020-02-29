const UsersModel = require('../models/users.model');

// eslint-disable-next-line no-console
const handlerError = console.error;

const add = (chatId, name, username) => {
  return UsersModel.create({ chatId, name, username }).catch(handlerError);
};

/**
 *
 * @param {number|string} chatId
 * @param {string} username
 * @returns {Promise<Schema.ObjectId>}
 */
const getIdByUsername = (chatId, username) => {
  return UsersModel.findOne({ chatId, username })
    .distinct('_id')
    .then(arr => arr[0])
    .catch(handlerError);
};

/**
 *
 * @param {number|string} chatId
 * @param {string} username
 * @return {Promise<Object>}
 */
const getIdAndNameByUsername = (chatId, username) => {
  return UsersModel.findOne({ chatId, username })
    .select('_id, name')
    .catch(handlerError);
};

/**
 * @param {number|string} chatId
 * @returns {Promise<UsersSchema[]>}
 */

const getAllByChatID = chatId => {
  return UsersModel.find({ chatId }).catch(handlerError);
};

module.exports = {
  add,
  getIdByUsername,
  getIdAndNameByUsername,
  getAllByChatID,
};
