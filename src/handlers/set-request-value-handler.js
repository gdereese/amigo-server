function setRequestValueHandler(key, value) {
  return (req, res, next) => {
    req[key] = value;

    next();
  };
}

module.exports = setRequestValueHandler;
