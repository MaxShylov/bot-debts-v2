const helpers = require('../helpers');
const botWorker = require('../workers/bot');
const queriesUtils = require('../utils/queries');
const { USERNAME_I } = require('../utils/constants');
const db = require('@db');

/**
 *
 * @param query
 * @param value
 * @return {{error: string}|{field: string, value: number|string}}
 */
const checkQuery = (query, value) => {
  const { label, type, isRequired } = query;
  const field = label;

  if (isRequired && !value) return { field, error: 'is required' };

  if (value) {
    if (type === 'integer') {
      value = +value;

      if (isNaN(value)) return { field, error: 'should be a number' };
      if (value < 1) return { field, error: 'should be more then 1' };
    }

    if (type === 'username') {
      if (value.charAt(0) !== '@') {
        return { field, error: 'should start with @' };
      }

      value = value.slice(1);
    }
  }

  return { field, value };
};

const checkQueries = async (globalData, queries, next) => {
  const hasComment = queries.includes(queriesUtils.comment);
  const limit = queries.length - (hasComment ? 1 : 0);
  const parsedMatch = helpers.common.parseMatch(globalData.match, limit);
  const { fromUsername, chatId } = globalData;

  let isError = false;
  const handlerErrorField = (field, errText) => {
    isError = true;
    botWorker.sendErrorField(globalData, field, errText);
  };

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];

    const checkedQuery = checkQuery(query, parsedMatch[i]);
    const { error, field } = checkedQuery;
    let { value } = checkedQuery;

    if (error) {
      handlerErrorField(field, error);
      break;
    }

    if (
      field === queriesUtils.debtorUsername.label ||
      field === queriesUtils.creditorUsername.label
    ) {
      if (USERNAME_I.includes(value)) value = fromUsername;

      const userId = await db.users.getIdByUsername(chatId, value);
      if (!userId) {
        botWorker.sendErrorUserIsNotFound(globalData, value);
        break;
      }
      globalData.fields[field.replace('Username', 'Id')] = userId;
    }

    globalData.fields[field] = value;
  }

  if (isError) return;

  return next(globalData);
};

module.exports = checkQueries;
