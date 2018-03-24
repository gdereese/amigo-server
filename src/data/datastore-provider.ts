import * as configuration from '../configuration/configuration';
import { IDatastore } from './datastore';

export function datastoreProvider(datastoreModuleName?: string): IDatastore {
  const moduleName =
    datastoreModuleName || configuration.getSettings().datastoreModule;
  const datasourceExport = require(moduleName).default;

  if (!datasourceExport) {
    throw new Error(`Module '${moduleName}' does not have a default export.`);
  }

  // if export is a class, instantiate it
  if (datasourceExport.prototype && datasourceExport.prototype.constructor) {
    return new datasourceExport();
  }

  return datasourceExport;
}
