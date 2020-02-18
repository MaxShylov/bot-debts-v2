const start = require('./start');
const help = require('./help');
const deleteBot = require('./deleteBot');
const sendMessageToAll = require('./sendMessageToAll');
const getChatId = require('./getChatId');


module.exports = (bot) => {

  bot.onText(/\/start/, async (msg) => await start(bot, msg));
  bot.onText(/\/help/, (msg) => help(bot, msg));
  bot.onText(/\/delete_bot/, (msg) => deleteBot(bot, msg));
  bot.onText(/\/channel/, (msg) => sendMessageToAll(bot, msg));
  bot.onText(/\/channel@bt_debts_bot/, (msg) => sendMessageToAll(bot, msg));
  bot.onText(/\/get_chat_id/, (msg) => getChatId(bot, msg));
  bot.onText(/\/get_chat_id@bt_debts_bot/, (msg) => getChatId(bot, msg));

};
