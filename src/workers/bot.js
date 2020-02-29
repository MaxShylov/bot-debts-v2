const { BOT_TOKEN } = process.env;

const TelegramBot = require('node-telegram-bot-api');
const isNull = require('lodash/isNull');

const helpers = require('../helpers');
const logsWorker = require('../workers/logs');
const examples = require('../utils/examples');

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

const onText = (regexp, callback) => bot.onText(regexp, callback);

// eslint-disable-next-line camelcase
const optionsBot = { parse_mode: 'HTML' };

const sendResponse = (globalData, response, time) => {
  time = isNull(time) ? 5 : time;
  const { chatId, command } = globalData;
  const { status, message, example } = response;
  const t = helpers.common.getMilliseconds(time);
  const statusText =
    status !== 'success' ? `<b>${status.toUpperCase()}</b>\n` : '';
  const exampleText = example ? `<i>(e.g. "${example}")</i>\n` : '';
  const msg = statusText + exampleText + message;
  const msgWithTime = !time ? msg : helpers.bot.makeMsgWithTime(msg, time);

  bot.sendMessage(chatId, msgWithTime, optionsBot).then(message => {
    if (process.env.NODE_ENV === 'development') return;
    setTimeout(() => bot.deleteMessage(chatId, message.message_id), t);
  });

  if (command !== '/get_logs') {
    logsWorker.addBotLog(globalData, response).catch(err => {
      if (err) {
        bot.sendMessage(chatId, 'Log has not saved', optionsBot);
      }
    });
  }
};

const sendErrorField = (globalData, errorField, errText) => {
  const { command, createResponse } = globalData;

  const response = createResponse(
    'error',
    `Field '${errorField}' ${errText}`,
    examples[command],
  );

  sendResponse(globalData, response);
};

const sendErrorUserIsNotFound = (globalData, username) => {
  sendResponse(
    globalData,
    globalData.createResponse('error', `User '@${username}' is not found.`),
  );
};

const sendErrorUserWasNotAdded = (globalData, username) => {
  sendResponse(
    globalData,
    globalData.createResponse('error', `User '@${username}' was not added.`),
  );
};

const sendErrorServer = globalData => {
  sendResponse(globalData, globalData.createResponse('Server error'));
};

module.exports = {
  onText,
  sendResponse,
  sendErrorField,
  sendErrorUserIsNotFound,
  sendErrorUserWasNotAdded,
  sendErrorServer,
};
