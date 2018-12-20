const schedule = require('node-schedule');

const LogsModel = require('../db/models/logs.model');
const { getId } = require('../helpers/common');
const { getDebts } = require('./debt.commands');

const compact = require('lodash').compact;
const reverse = require('lodash').reverse;

const startText = `
Данный бот был создан для контроля за долгами между людьми.
Изначально добавьте всех ползователей воспользовавшись командой
/add_user [ИМЯ] [ЛОГИН]
Потом вы сможете добавлять (/add) и удалять (/del) долги:
/add(del) [ЛОГИН_КТО] [ЛОГИН_КОМУ] [СУММА]

Каждое 11 число будет автоматически выводиться список долгов.
Или же вывести их вручную командой /get_debts

Про все команды вы можете узнать воспользовавшись командой /help
`;

const helpText = `
/add - Добавить долг (/add [ЛОГИН_КТО] [ЛОГИН_КОМУ] [СУММА]) *
/del - Отдать долг (/del [ЛОГИН_КТО] [ЛОГИН_КОМУ] [СУММА]) *
/get_debts - Получить список долгов
/get_logs - Получить список логов
/add_user - Добавление пользователя (/add [ИМЯ] [ЛОГИН])
/list_users - Показать всех пользователей
/del_all - Отдать все долги 


* В комaнде /add & /del вместо логина можно писать @i, @I, @me для того чтоб бот использовал ваш логин

/delete_bot - Удалить бот
`;


module.exports = (bot) => {

  // START
  bot.onText(/\/start/, async (msg) => {
    const chatId = getId(msg);

    schedule.scheduleJob({ date: 11 }, async () => {
      const str = await getDebts();

      bot.sendMessage(chatId, str);
    });

    return bot.sendMessage(chatId, startText);
  });


  // HELP
  bot.onText(/\/help/, (msg) => bot.sendMessage(getId(msg), helpText));


  // DELETE_BOT
  bot.onText(/\/delete_bot/, (msg) => {
    const chatId = getId(msg);

    bot.sendMessage(chatId, 'Прощайте! :(');
    bot.leaveChat(chatId);
  });

  const getLogs = async (msg) => {
    const
      chatId = getId(msg),
      count = +compact(msg.text.split(' '))[1];

    const logs = await LogsModel.find({ chatId }).sort('-createAt').limit(count || 3);

    let answer = '========';

    for (let i = logs.length - 1; i > -1; i--) {
      answer += '\n' + logs[i].createAt.toLocaleString() + '\n' + logs[i].log + '\n========'
    }

    return bot
      .sendMessage(chatId, answer)
      .then((message) => setTimeout(() => bot.deleteMessage(chatId, message.message_id), 15000));
  };

  bot.onText(/\/get_logs/, async (msg) => await getLogs(msg));

};
