import * as configuration from '../configuration/configuration';
import { IDatastore } from './datastore';

export function datastoreProvider(datastoreModuleName?: string): IDatastore {
  const moduleName =
    datastoreModuleName || configuration.getSettings().datastoreModule;
  const moduleExport = require(moduleName).default;

  if (!moduleExport) {
    throw new Error(`Module '${moduleName}' does not have a default export.`);
  }

  if (!moduleExport.prototype.constructor) {
    throw new Error(
      `Export '${moduleExport.toString()}' is not an instantiable class.`
    );
  }

  const datastore = new moduleExport();

  if (!isInstanceOfIDatastore(datastore)) {
    throw new Error(
      `Export '${moduleExport.toString()}' does not implement the IDatastore interface.`
    );
  }

  return datastore;
}

function isInstanceOfIDatastore(obj: any): obj is IDatastore {
  return 'friends' in obj && 'friendRequests' in obj;
}
