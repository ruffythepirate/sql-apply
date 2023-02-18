import { runMigrations } from './run-migrations';
import {ensureDatabaseExists, getMigrationsDoneInDB} from "./ensure-migration-table";
import {findMigrationsRelativeToCwd} from "./migration/migration-finder";
import {MigrationDefinition} from './migration/MigrationDefinition';
import {applyMigration} from './migration/apply-migration';
import {populateDefaultOptions} from './options/populate-default-options';

jest.mock('./ensure-migration-table', () => ({
  ensureDatabaseExists: jest.fn(),
  ensureMigrationTable: jest.fn(),
  getMigrationsDoneInDB: jest.fn(),
}));

jest.mock('./migration/migration-finder', () => ({
  findMigrationsRelativeToCwd: jest.fn(),
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
      new MigrationDefinition('', '1', 'test'),
    ]);
  });

  it('should ensure database exists', async () => {
    await runMigrations(client);
    expect(ensureDatabaseExists).toHaveBeenCalledWith(client, 'postgres');
  });

  it('should throw if name of migrations have changed', async () => {
    (getMigrationsDoneInDB as jest.Mock).mockResolvedValueOnce([
      new MigrationDefinition('', '1', 'test'),
    ]);
    (findMigrationsRelativeToCwd as jest.Mock).mockResolvedValueOnce([
      new MigrationDefinition('', '1', 'test_changed'),
    ]);

    await expect(runMigrations(client)).rejects.toThrowError();
  });

  it('should throw if name of migrations have been removed', async () => {
    (getMigrationsDoneInDB as jest.Mock).mockResolvedValueOnce([
      new MigrationDefinition('', '1', 'test'),
    ]);
    (findMigrationsRelativeToCwd as jest.Mock).mockResolvedValueOnce([]);

    await expect(runMigrations(client)).rejects.toThrowError();
  });

  it('should apply migrations', async () => {
    await runMigrations(client);
    expect(applyMigration).toHaveBeenCalledWith(new MigrationDefinition('', '1', 'test'), client, populateDefaultOptions({}));
  });

});

