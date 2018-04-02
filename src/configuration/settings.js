class Settings {
  constructor(obj) {
    this.datastore = obj.datastore
      ? new DatastoreSettings(obj.datastore)
      : null;
  }
}

class DatastoreSettings {
  constructor(obj) {
    this.module = obj.module;
    this.options = obj.options;
  }
}

module.exports = Settings;
