import {populateDefaultOptions} from "./populate-default-options";

describe('populateDefaultOptions', () => {

  it('should populate default options', () => {
    const options = populateDefaultOptions({});
    expect(options).toEqual({
      databaseName: 'postgres',
      migrationTable: 'migrations',
      migrationTableSchema: 'public'
    });
  });

  it('should not override provided options', () => {
    const options = populateDefaultOptions({
      databaseName: 'test',
      migrationTable: 'test',
      migrationTableSchema: 'test'
    });
    expect(options).toEqual({
      databaseName: 'test',
      migrationTable: 'test',
      migrationTableSchema: 'test'
    });
  });
});
