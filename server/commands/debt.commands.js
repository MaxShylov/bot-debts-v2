const escapeRegExp = require('lodash').escapeRegExp;
const isNaN = require('lodash').isNaN;
const isEmpty = require('lodash').isEmpty;
const findKey = require('lodash').findKey;

const DebtsModel = require('../models/debts.model');


const getButtons = async (chatId, name = '') => {
  const
    users = await DebtsModel.find({ chatId }).lean().exec(),
    btns = [];

  if (isEmpty(users)) return;

  users.push({ name: 'Отмена операции', cmd: '/cancel' });

  users.filter(i => i.name !== name).map((i, k) => {
    if (i.name === name) return;

    if (!(k % 2)) {
      btns.push([{ text: i.name, callback_data: i.login || i.cmd }])
    } else {
      const index = Math.ceil(k / 2 - 1);
      btns[index].push({ text: i.name, callback_data: i.login || i.cmd })
    }
  });

  return btns
};


module.exports = (bot) => {

  let
    from = null,
    to = null,
    sum = null,
    isRepay = false;
  reminder = null; //TODO сделать напоминание через 15 сек после ввода долгов

  const clear = () => {
    from = null;
    to = null;
    sum = null;
    isRepay = false;
  };

  bot.onText(/\/add_debt/, async (msg, match) => {
    const
      chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id,
      text = 'Кто должен?',
      buttons = await getButtons(chat),
      options = {
        row_width: 2,
        reply_markup: JSON.stringify({
          inline_keyboard: buttons,
          parse_mode: 'Markdown'
        })
      };

    if (!buttons) {
      clear();
      return bot.sendMessage(chat,
        'Нет пользователей в чате.\n' +
        'Добавить пользователя: /add_user [ИМЯ] [ЛОГИН]'
      )
    }

    clear();

    bot.sendMessage(chat, text, options);
  });


  bot.onText(/\/repay_debt/, async (msg, match) => {
    const
      chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id,
      text = 'Кто отдал?',
      buttons = await getButtons(chat),
      options = {
        row_width: 2,
        reply_markup: JSON.stringify({
          inline_keyboard: buttons,
          parse_mode: 'Markdown'
        })
      };


    if (!buttons) {
      clear();
      return bot.sendMessage(chat,
        'Нет пользователей в чате.\n' +
        'Добавить пользователя: /add_user [ИМЯ] [ЛОГИН]'
      )
    }

    clear();

    isRepay = true;

    bot.sendMessage(chat, text, options);
  });

  bot.on('callback_query', async (msg) => {
    const chat = msg.hasOwnProperty('chat')
      ? msg.chat.id
      : msg.hasOwnProperty('message')
        ? msg.message.hasOwnProperty('chat')
          ? msg.message.chat.id
          : msg.from.id
        : msg.from.id;
    let login, name;

    if (msg.data === '/cancel') {
      const
        textDebt = 'Добавление долга отменено',
        textRepay = 'Возврат долга отменен';

      clear()
      bot.sendMessage(chat, isRepay ? textRepay : textDebt);
      bot.deleteMessage(chat, msg.message.message_id);
    }

    if (!to) {
      login = msg.data;
      name = await DebtsModel
        .findOne({
          login: { $regex: escapeRegExp(login), $options: 'i' },
          chatId: chat
        })
        .lean()
        .exec();

      name = name.name
    } else {
      login = msg.data;
    }

    if (!from) {

      from = { name, login };

      console.log('from', from);

      const
        text = `Кому ${isRepay ? 'отдал' : 'должен'} ${from.name} ?`,
        options = {
          reply_markup: JSON.stringify({
            inline_keyboard: await getButtons(chat, from.name),
            parse_mode: 'Markdown'
          })
        };

      bot.sendMessage(chat, text, options);
      bot.deleteMessage(chat, msg.message.message_id);
    } else if (!to) {
      to = { name, login };

      const text = `Сколько ${isRepay ? 'отдал' : 'должен'} ${from.name} ${to.name}?\nВведите сумму через комманду /sum [СУММА]`;

      bot.sendMessage(chat, text);
      bot.deleteMessage(chat, msg.message.message_id);
    } else {

      const debt = await DebtsModel
        .findOne({
          login: { $regex: escapeRegExp(from.login), $options: 'i' },
          chatId: chat
        })
        .lean()
        .exec();

      const query = {
        name: from.name,
        chatId: chat
      };

      const newDebt =
        isRepay
          ? {
            ...debt,
            total: +debt.total - +sum,
            debts: {
              ...debt.debts,
              [to.login]: debt.debts && debt.debts[to.login] ? +debt.debts[to.login] - +sum : -+sum
            }
          }
          : {
            ...debt,
            total: +debt.total + +sum,
            debts: {
              ...debt.debts,
              [to.login]: debt.debts && debt.debts[to.login] ? +debt.debts[to.login] + +sum : +sum
            }
          };

      DebtsModel.findOneAndUpdate(query, newDebt, { upsert: true }, (err, doc) => {
        bot.deleteMessage(chat, msg.message.message_id);

        if (err) {
          bot.sendMessage(chat, 'error: Данные не записались в базу');
        } else {
          bot.sendMessage(chat, `${from.name} ${isRepay ? 'отдал' : 'должен'} ${to.name} ${sum}грн.`);
        }
        clear();
      });

    }
  });

  bot.onText(/\/sum (.+)/, (msg, match) => {
    const chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;

    if (!from) {
      clear();
      return bot.sendMessage(chat, 'Не указано кто должен, воспользуйтесь коммандой /add_debt');
    } else if (!to) {
      clear();
      return bot.sendMessage(chat, 'Не указано кому должны, начните сначало воспользовавшись коммандой /add_debt');
    } else if (isNaN(+match[1])) {
      return bot.sendMessage(chat, 'Введите, пожалуйста, целое число');
    } else if (!match[1]) {
      return bot.sendMessage(chat, 'Введите, пожалуйста, сумму');
    }

    sum = match[1];

    const
      text = `${from.name} ${isRepay ? 'отдал' : 'должен'} ${to.name} ${sum}грн?`,
      options = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [
              { text: 'Да', callback_data: 'true' },
              { text: 'Отмена', callback_data: 'false' }
            ]
          ],
          parse_mode: 'Markdown'
        })
      };

    if (sum) bot.sendMessage(chat, text, options);
  });

  bot.onText(/\/cancel/, (msg, match) => {
    const chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;

    clear();
    bot.sendMessage(chat, 'Добавление/возрат долга отменено');
    bot.deleteMessage(chat, msg.message.message_id);
  });


  bot.onText(/\/get_debts/, async (msg, match) => {
    const
      chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id,
      debts = await DebtsModel.find({ chatId: chat }).lean().exec();

    let str = '_____________ Debts _____________';

    debts.map(i => {
      if (i.debts && Object.keys(i.debts).length && !!findKey(i.debts, (v) => v > 0)) {
        str += '\n' + i.name + ': ' + i.total + '\n';

        Object.keys(i.debts).map(j => {
          const name = debts.filter(x => x.login === j)[0].name;

          if (i.debts[j]) str += '\b\b\b\b\b\b\b > ' + name + ': ' + i.debts[j] + '\n'
        })
      } else {
        str += '\n' + i.name + ': Нет долгов\n'
      }

      str += '__________________________________'
    });

    bot.sendMessage(chat, str).then(message => setTimeout(() => bot.deleteMessage(chat, message.message_id), 15000));

  });
};
