const start = require('./start');
const help = require('./help');
const deleteBot = require('./deleteBot');


module.exports = (bot) => {

  bot.onText(/\/start/, async (msg) => await start(bot, msg));
  bot.onText(/\/help/, (msg) => help(bot, msg));
  bot.onText(/\/delete_bot/, (msg) => deleteBot(bot, msg));
  bot.onText(/\/channel/, (msg) => deleteBot(bot, msg));

};
