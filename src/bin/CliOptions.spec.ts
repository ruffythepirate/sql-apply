import {parseCliArgs, toMigrationOptions, withDefaultOptions} from "./CliOptions";

describe('CliOptions', () => {

  it('should provide default options', () => {
    const options = withDefaultOptions({});

    expect(options).toEqual({
      database: 'postgres',
      host: 'localhost',
      user: 'postgres',
      password: 'postgres',
      port: 5432,
      migrationsDir: 'migrations',
      migrationsTable: 'migrations',
      migrationsSchema: 'public',
      migrationsTimeoutInSeconds: 60
    });
  });

  it('should override default options', () => {
    const options = withDefaultOptions({
      database: 'my-db',
      host: 'my-host',
    });

    expect(options).toMatchObject({
      database: 'my-db',
      host: 'my-host',
    });
  });

  it('should parse args', () => {
    const options = parseCliArgs({
      host: 'my-host',
      password: 'my-password',
    });

    expect(options).toMatchObject({
      host: 'my-host',
      password: 'my-password',
    });
  });

  it('should translate cli options to migration options', () => {
    const options = parseCliArgs({
      migrationsTable: 'my-migrations-table',
      migrationsSchema: 'my-migrations-schema',
      migrationsTimeoutInSeconds: 123,
    });

    const migrationOptions = toMigrationOptions(options);

    expect(migrationOptions).toMatchObject({
      migrationTable: 'my-migrations-table',
      migrationTableSchema: 'my-migrations-schema',
      timeoutInSeconds: 123,
    });
  });
});

