const db = require('../../db');

const add = ({ globalData, dataDebt }) => {
  return db.debtsHistory.add(globalData.chatId, 'add', dataDebt);
};

module.exports = {
  add,
};
