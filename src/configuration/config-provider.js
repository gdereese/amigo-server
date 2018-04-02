const Settings = require('./settings');

var config = new Settings();

const configProvider = {
  getConfig() {
    return config;
  },

  setConfig(value) {
    config = value;
  }
};

module.exports = configProvider;
