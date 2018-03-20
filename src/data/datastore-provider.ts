import * as configuration from '../configuration/configuration';
import { IDatastore } from './datastore';

export function DatastoreProvider(): IDatastore {
  const settings = configuration.getSettings();

  const datastore = require(settings.datastoreModule).default;

  return new datastore();
}
