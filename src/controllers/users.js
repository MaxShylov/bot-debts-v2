const isEmpty = require('lodash/isEmpty');

const db = require('../../db');
const helpers = require('../helpers');
const botWorker = require('../workers/bot');

/**
 * Add user
 * @param {*} globalData
 * @return {Promise<void>}
 */
const add = async globalData => {
  const {
    chatId,
    createResponse,
    fields: { name, username },
  } = globalData;
  const user = await db.users.add(chatId, name, username);

  const response = createResponse(
    user ? 'success' : 'error',
    `User ${name} (@${username}) has ${!user ? 'not ' : ''}created!`,
  );

  botWorker.sendResponse(globalData, response);
};

/**
 * Get user ID
 */
const getId = async globalData => {
  const {
    chatId,
    createResponse,
    fields: { username },
  } = globalData;

  const id = await db.users.getIdByUsername(chatId, username);

  const response = createResponse(id ? 'success' : 'error');
  response.message = id ? id : 'Use is not found';

  botWorker.sendResponse(globalData, response, 0);
};

/**
 * Update user
 */
const update = () => {
  // eslint-disable-next-line no-console
  console.log('INFO: controllers.users.update was not created');
};

/**
 * Get all users by current chat
 * @param {*} globalData
 * @return {Promise<void>}
 */
const getAll = async globalData => {
  const {
    chatId,
    createResponse,
    fields: { time },
  } = globalData;

  const users = await db.users.getAllByChatID(chatId);

  if (!users) {
    botWorker.sendErrorServer(globalData);
    return;
  }

  const hasUsers = !isEmpty(users);
  const t = time || (hasUsers && 10);

  const response = createResponse(
    hasUsers ? 'success' : 'warning',
    helpers.responses.makeMsgAllUsers(users),
  );

  botWorker.sendResponse(globalData, response, t);
};

module.exports = {
  add,
  getId,
  update,
  getAll,
};
