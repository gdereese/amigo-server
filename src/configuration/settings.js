class Settings {
  constructor(obj) {
    if (!obj) {
      return;
    }

    this.datastore = obj.datastore
      ? new DatastoreSettings(obj.datastore)
      : null;
  }
}

class DatastoreSettings {
  constructor(obj) {
    if (!obj) {
      return;
    }

    this.module = obj.module;
    this.options = obj.options;
  }
}

module.exports = Settings;
