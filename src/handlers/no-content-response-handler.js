function noContentResponseHandler() {
  return (req, res, next) => {
    res.send(204);

    next();
  };
}

module.exports = noContentResponseHandler;
