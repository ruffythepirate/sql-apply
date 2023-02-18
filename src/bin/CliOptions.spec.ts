import {parseCliArgs, toMigrationOptions, withDefaultOptions, withEnvironmentOptions} from "./CliOptions";

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

  describe('withEnvironmentOptions', () => {
    it('should add environment options if nothing defined', () => {
      const options = {};
      const environment = {
        PGHOST: 'my-host',
        PGPASSWORD: 'my-password',
        PGDATABASE: 'my-db',
        PGUSER: 'my-user',
        PGPORT: 123,
      };

      const optionsWithEnvironment = withEnvironmentOptions(options, environment);

      expect(optionsWithEnvironment).toMatchObject({
        host: 'my-host',
        password: 'my-password',
        database: 'my-db',
        user: 'my-user',
        port: 123,
      });
    });

    it('should not override cli options', () => {
      const options = withDefaultOptions({});
      const environment = {
        PGHOST: 'my-host',
        PGPASSWORD: 'my-password',
        PGDATABASE: 'my-db',
        PGUSER: 'my-user',
        PGPORT: 123,
      };

      const optionsWithEnvironment = withEnvironmentOptions(options, environment);

      expect(optionsWithEnvironment).toMatchObject(options);
    });
  });
});

