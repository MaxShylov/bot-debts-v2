const makeMsgWithTime = (text, time) => {
  return `${text}\n<i>(Message will be deleted in ${time}s)</i>`;
};

module.exports = {
  makeMsgWithTime,
};
