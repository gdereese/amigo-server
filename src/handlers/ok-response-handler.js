function okResponseHandler(reqKeyToBody) {
  return (req, res, next) => {
    res.send(200, req[reqKeyToBody]);

    next();
  };
}

module.exports = okResponseHandler;
