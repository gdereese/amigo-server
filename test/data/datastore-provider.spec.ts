import { datastoreProvider } from '../../src/data/datastore-provider';

describe('datastore-provider', () => {
  it('should return the default export of the specified TypeScript module', () => {
    const moduleName = '../../test/fixtures/mock-ts-datastore';

    const datastore = datastoreProvider(moduleName);

    expect(datastore).toBeTruthy();
  });

  it('should return a loosely-typed export if it conforms to the expected type', () => {
    const moduleName = '../../test/fixtures/mock-any-datastore';

    const datastore = datastoreProvider(moduleName);

    expect(datastore).toBeTruthy();
  });

  it("should throw an error if module isn't found", () => {
    const moduleName = 'xxx';

    expect(() => datastoreProvider(moduleName)).toThrowError();
  });

  it("should throw an error if the module doesn't have a default export", () => {
    const moduleName = '../../src/data/datastore-provider';

    expect(() => datastoreProvider(moduleName)).toThrowError();
  });
});
