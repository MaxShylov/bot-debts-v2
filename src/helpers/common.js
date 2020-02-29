// eslint-disable-next-line no-prototype-builtins
const getId = msg => (msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id);
const getUsername = msg => msg.from.username;
const getCommand = msg => msg.text.match(/\/\w+/)[0];

/**
 * @param {object} match
 * @param {number} [limit]
 * @returns {[string]}
 */
const parseMatch = (match, limit) => {
  const fields = match[1] || match[2];

  if (!fields) return [];
  const arrMatch = fields
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ');

  return [
    ...arrMatch.splice(0, limit || arrMatch.length - 1),
    arrMatch.join(' '),
  ];
};

const getMilliseconds = seconds => seconds * 1000;

module.exports = {
  getId,
  getUsername,
  getCommand,
  parseMatch,
  getMilliseconds,
};
