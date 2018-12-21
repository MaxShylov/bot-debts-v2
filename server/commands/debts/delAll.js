const keys = require('lodash/keys');
const isEmpty = require('lodash/isEmpty');

const updateDebts = require('./updateDebts');
const { getId, getDebt, messageWithRemove } = require('../../helpers/common');
const config = require('../../config');


module.exports = async (bot, msg) => {
  const
    chatId = getId(msg),
    message = (text, t) => messageWithRemove(bot, chatId, text, t || 3);

  if (!config.get('dbConnected')) return message('Database is not connect');

  const
    login = msg.from.username,
    query = { login, chatId },
    debt = await getDebt(bot, chatId, query),
    newDebt = {
      ...debt,
      total: 0,
      debts: {}
    };

  if (!debt) return message(`Пользователь ${login} не найден`);
  if (isEmpty(debt.debts)) return message(`У пользователя и так нет долгов`);

  let successText = '';

  console.log('debt.debts', debt.debts);

  for (let i = 0; i < keys(debt.debts).length; i++) {
    const name = keys(debt.debts)[i];
    successText += `@${login} отдал @${name } ${Math.abs(debt.debts[name])}грн.\n`;
  }

  console.log('successText', successText);

  await updateDebts({ bot, chatId, query, newDebt, successText, type: 'dellAll' });
};
