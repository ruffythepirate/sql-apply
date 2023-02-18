import {MigrationOptions} from "../options/MigrationOptions";


export interface CliOptions {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
  migrationsDir?: string;
  migrationsTable?: string;
  migrationsSchema?: string;
  migrationsTimeoutInSeconds?: number;
}

export function withDefaultOptions(cliOptions: CliOptions): CliOptions {
  return {
    host: cliOptions.host || 'localhost',
    password: cliOptions.password || 'postgres',
    user: cliOptions.user || 'postgres',
    port: cliOptions.port || 5432,
    database: cliOptions.database || 'postgres',
    migrationsDir: cliOptions.migrationsDir || 'migrations',
    migrationsTable: cliOptions.migrationsTable || 'migrations',
    migrationsSchema: cliOptions.migrationsSchema || 'public',
    migrationsTimeoutInSeconds: cliOptions.migrationsTimeoutInSeconds || 60
  };
}

export function withEnvironmentOptions(cliOptions: CliOptions, environment: any): CliOptions {
  const copy = Object.assign({}, cliOptions);
  copy.host = cliOptions.host || environment.PGHOST;
  copy.password = cliOptions.password || environment.PGPASSWORD;
  copy.user = cliOptions.user || environment.PGUSER;
  copy.port = cliOptions.port || environment.PGPORT;
  copy.database = cliOptions.database || environment.PGDATABASE;
  return copy;
}


export function parseCliArgs(args: any): CliOptions {
  return {
    host: args.host,
    password: args.password,
    user: args.user,
    port: args.port,
    database: args.database,
    migrationsDir: args.migrationsDir,
    migrationsTable: args.migrationsTable,
    migrationsSchema: args.migrationsSchema,
    migrationsTimeoutInSeconds: args.migrationsTimeoutInSeconds
  };
}

export function toMigrationOptions(cliOptions: CliOptions): MigrationOptions {
  return {
    migrationTable: cliOptions.migrationsTable,
    migrationTableSchema: cliOptions.migrationsSchema,
    timeoutInSeconds: cliOptions.migrationsTimeoutInSeconds
  };
}
