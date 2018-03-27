import { datastoreProvider } from '../../src/data/datastore-provider';

describe('datastore-provider', () => {
  it('should return the default export of the specified module', () => {
    const moduleName = '../../test/fixtures/mock-datastore';

    const datastore = datastoreProvider(moduleName);

    expect(datastore).toBeTruthy();
  });

  it('should throw an error if module is not found', () => {
    const moduleName = 'xxx';

    expect(() => datastoreProvider(moduleName)).toThrowError();
  });

  it('should throw an error if the module does not have a default export', () => {
    const moduleName = '../../test/fixtures/no-export';

    expect(() => datastoreProvider(moduleName)).toThrowError();
  });

  it('should throw an error if the module does not export an instantiable class', () => {
    const moduleName = '../../test/fixtures/default-export-object';

    expect(() => datastoreProvider(moduleName)).toThrowError();
  });

  it('should throw an error if the module does not export class that implements IDatastore', () => {
    const moduleName = '../../test/fixtures/default-export-class';

    expect(() => datastoreProvider(moduleName)).toThrowError();
  });
});
