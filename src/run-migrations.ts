import {Client} from "pg";
import {ensureDatabaseExists} from "./ensure-migration-table";
import {ensureMigrationTable, getMigrationsDoneInDB, Migration} from "./migration/db/Migration";
import {applyMigration} from "./migration/apply-migration";
import {findMigrationsRelativeToCwd} from "./migration/migration-finder";
import {MigrationPointer} from "./migration/MigrationPointer";
import {MigrationOptions} from "./options/MigrationOptions";
import {populateDefaultOptions} from "./options/populate-default-options";

/**
 * Runs all the migrations in the defined relative path to current working directory. 
 * Default value and convention is for this path to be sql/migrations, but it can be changed.
 */
export async function runMigrations(client: Client, migrationsPath: string[] = ["sql/migrations"], migrationOptions: MigrationOptions = {}) {
  if(migrationOptions.timeoutInSeconds) {
    return await withTimeout(runMigrationsInternal(client, migrationsPath, migrationOptions), migrationOptions.timeoutInSeconds);
  } else {
    await runMigrationsInternal(client, migrationsPath, migrationOptions);
  }
}

function withTimeout<T>(promise: Promise<T>, timeoutInSeconds: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timeout of ${timeoutInSeconds} seconds exceeded`));
    }, timeoutInSeconds * 1000);
    promise.then((result) => {
      clearTimeout(timeout);
      resolve(result);
    }, (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

async function runMigrationsInternal(client: Client, migrationsPath: string[], migrationOptions: MigrationOptions = {}) {
  const migrationOptionsWithDefaults = populateDefaultOptions(migrationOptions);
  await ensureDatabaseExists(client, migrationOptionsWithDefaults.databaseName!);
  await ensureMigrationTable(client, migrationOptionsWithDefaults);

  const migrationsInDb = await getMigrationsDoneInDB(client, migrationOptionsWithDefaults);
  const migrationsScripts = await findMigrationsRelativeToCwd(migrationsPath);

  console.log('migrations scripts found', migrationsScripts);

  ensureMigrationsHaventChanged(migrationsInDb, migrationsScripts);

  const migrationsToPerform = migrationsScripts.filter(m => migrationsInDb.find(migration => migration.version === m.version) === undefined);

  for (const migration of migrationsToPerform) {
    await applyMigration(migration, client, migrationOptionsWithDefaults);
  }

}


function ensureMigrationsHaventChanged(migrationsInDb: Migration[], migrationsToPerform: MigrationPointer[]) {
  migrationsInDb.forEach(migration => {
    const migrationToPerform = migrationsToPerform.find(m => m.version === migration.version);
    if (migrationToPerform === undefined) {
      throw new Error(`Migration ${migration.version} has been removed`);
    }
    if (migrationToPerform.description !== migration.description) {
      throw new Error(`Migration ${migration.version} has been changed`);
    }
  });
}
