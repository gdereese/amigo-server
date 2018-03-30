var config = {};

const configProvider = {
  getConfig() {
    return config;
  },

  setConfig(value) {
    config = value;
  }
};

module.exports = configProvider;
