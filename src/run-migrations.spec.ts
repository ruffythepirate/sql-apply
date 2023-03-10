import { runMigrations } from './run-migrations';
import {ensureDatabaseExists} from "./ensure-migration-table";
import { getMigrationsDoneInDB } from './migration/db/Migration';
import {findMigrationsRelativeToCwd} from "./migration/migration-finder";
import {MigrationPointer} from './migration/MigrationPointer';
import {applyMigration} from './migration/apply-migration';
import {populateDefaultOptions} from './options/populate-default-options';

jest.mock('./ensure-migration-table', () => ({
  ensureDatabaseExists: jest.fn(),
}));

jest.mock('./migration/migration-finder', () => ({
  findMigrationsRelativeToCwd: jest.fn(),
}));

jest.mock('./migration/db/Migration', () => ({
  ...jest.requireActual('./migration/db/Migration'),
  getMigrationsDoneInDB: jest.fn(),
  ensureMigrationTable: jest.fn(),
}));

jest.mock('./migration/apply-migration', () => ({
  applyMigration: jest.fn(),
}));

describe('runMigrations', () => {

  const client = {
    query: jest.fn(),
  } as any;

  beforeEach(() => {
    (getMigrationsDoneInDB as jest.Mock).mockResolvedValue([]);
    (findMigrationsRelativeToCwd as jest.Mock).mockResolvedValue([
      new MigrationPointer('', '1', 'test'),
    ]);
  });

  it('should ensure database exists', async () => {
    await runMigrations(client);
    expect(ensureDatabaseExists).toHaveBeenCalledWith(client, 'postgres');
  });

  it('should throw if name of migrations have changed', async () => {
    (getMigrationsDoneInDB as jest.Mock).mockResolvedValueOnce([
      new MigrationPointer('', '1', 'test'),
    ]);
    (findMigrationsRelativeToCwd as jest.Mock).mockResolvedValueOnce([
      new MigrationPointer('', '1', 'test_changed'),
    ]);

    await expect(runMigrations(client)).rejects.toThrowError();
  });

  it('should throw if name of migrations have been removed', async () => {
    (getMigrationsDoneInDB as jest.Mock).mockResolvedValueOnce([
      new MigrationPointer('', '1', 'test'),
    ]);
    (findMigrationsRelativeToCwd as jest.Mock).mockResolvedValueOnce([]);

    await expect(runMigrations(client)).rejects.toThrowError();
  });

  it('should apply migrations', async () => {
    await runMigrations(client);
    expect(applyMigration).toHaveBeenCalledWith(new MigrationPointer('', '1', 'test'), client, populateDefaultOptions({}));
  });

  it('should apply migrations with timeout', async () => {
    (getMigrationsDoneInDB as jest.Mock).mockResolvedValueOnce([
      new MigrationPointer('', '1', 'test'),
    ]);
    (findMigrationsRelativeToCwd as jest.Mock).mockResolvedValueOnce([]);

    await expect(runMigrations(client, [], {timeoutInSeconds:5})).rejects.toThrowError();
  });

  it('should handle error when apply migrations with timeout', async () => {
    await runMigrations(client, [], { timeoutInSeconds: 5 });
    expect(applyMigration).toHaveBeenCalledWith(new MigrationPointer('', '1', 'test'), client, populateDefaultOptions({}));
  });

  it('should throw timeout error if migration takes too long', async () => {
    let timeoutId: NodeJS.Timeout | undefined;
    const longTimePromise = new Promise(resolve => {
      timeoutId = setTimeout(resolve, 10000)
    });
    (applyMigration as jest.Mock).mockImplementation(() => longTimePromise);
    await expect(runMigrations(client, [], { timeoutInSeconds: 1 })).rejects.toThrowError();
    clearTimeout(timeoutId!);
  });
});

