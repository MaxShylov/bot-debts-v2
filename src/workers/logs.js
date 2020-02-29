const moment = require('moment');

const db = require('../../db');

const removeOldLogs = () => {
  const olderThan = moment()
    .subtract(3, 'months')
    .toDate();

  return db.logs.deleteOlderThan(olderThan);
};

const addBotLog = async (globalData, { status, message }) => {
  const { chatId, from, command, request } = globalData;
  const data = { from, command, request, message, status };
  data.user = await db.users.getIdByUsername(chatId, from);

  removeOldLogs();

  return db.logs.add(chatId, 'bot', data);
};

module.exports = {
  addBotLog,
};
