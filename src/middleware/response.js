const db = require('../../db');
const helpers = require('../helpers');
const checkQueries = require('./checkQueries');

/**
 * @typedef {Object} Query
 * @property {string} label
 * @property {string} type
 * @property {boolean} isRequired
 */

/**
 * @param {function} next
 * @param {[Query|[Query]]} queries
 * @return {function(...[*]=)}
 */
const response = (next, queries) => async (msg, match) => {
  const chatId = helpers.common.getId(msg);
  const fromUsername = helpers.common.getUsername(msg);
  const command = helpers.common.getCommand(msg);
  let user = await db.users.getIdAndNameByUsername(chatId, fromUsername);
  user = user || {};
  const globalData = {
    msg,
    match,
    chatId,
    fromUsername,
    fromId: user.id,
    fromName: user.name,
    command,
    request: msg.text,
    fields: {},
    createResponse: (status = '', message = '', example = '') => ({
      status,
      message,
      example,
    }),
  };

  if (!queries) return next(msg, match, globalData);

  return checkQueries(globalData, queries, next);
};

module.exports = response;
