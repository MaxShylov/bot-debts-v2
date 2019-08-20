const keys = require('lodash/keys');
const isEmpty = require('lodash/isEmpty');

const updateDebts = require('./updateDebts');
const { getId, getDebt, messageWithRemove } = require('../../helpers/common');
const config = require('../../config');
const saveLog = require('../logs/saveLog');


module.exports = async (bot, msg) => {
  const
    chatId = getId(msg),
    message = (text, t) => messageWithRemove(bot, chatId, text, t || 3);

  if (!config.get('dbConnected')) return message('База данных не подключена, попробуйте позже');

  const
    login = msg.from.username,
    query = { login, chatId },
    debt = await getDebt(bot, chatId, query),
    newDebt = {
      ...debt,
      total: 0,
      debts: {},
    };

  if (!debt) return message(`Пользователь ${login} не найден`);
  if (isEmpty(debt.debts)) return message(`У пользователя и так нет долгов`);

  const text = `${msg.from.first_name}, ты уверен?`;
  const options = {
    reply_markup: JSON.stringify({
      resize_keyboard: true,
      one_time_keyboard: true,
      keyboard: [
        ['Нет', 'Нет', 'Да', 'Нет', 'Нет', 'Нет', 'Нет'],
      ],
      parse_mode: 'HTML',
    }),
  };

  bot.sendMessage(chatId, text, options).then(ans => {
    bot.once('message', async (msg) => {
      if(msg.text === 'Да') {
        let successText = '';

        for (let i = 0; i < keys(debt.debts).length; i++) {
          const name = keys(debt.debts)[i];
          successText += `@${login} отдал @${name} ${Math.abs(debt.debts[name])}грн.\n`;
        }

        const status = await updateDebts({ bot, chatId, query, newDebt });

        if (status) {
          saveLog(chatId, successText);
          message(successText, 100)
        }
      } else {
        message('Так чё ты левые комманды клацаешь?', 5)
      }
    });
  });
};


