import { IDatastore } from './datastore';
import { InMemoryDatastore } from './in-memory/in-memory-datastore';

export function DatastoreProvider(): IDatastore {
  return new InMemoryDatastore();
}
