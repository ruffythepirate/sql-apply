import {MigrationOptions} from "./MigrationOptions";

export function populateDefaultOptions(options: MigrationOptions): MigrationOptions {

  const defaultOptions: MigrationOptions = {
    databaseName: 'postgres',
    migrationTable: 'migrations',
    migrationTableSchema: 'public'
  };
  return Object.assign(defaultOptions, options);
}
