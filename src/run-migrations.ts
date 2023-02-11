import {Client} from "pg";
import {ensureDatabaseExists, ensureMigrationTable, getMigrationsDoneInDB} from "./ensure-migration-table";
import {applyMigration} from "./migration/apply-migration";
import {findMigrationsRelativeToCwd} from "./migration/migration-finder";
import {MigrationDefinition} from "./migration/MigrationDefinition";

/**
 * Runs all the migrations in the defined relative path to current working directory. 
 * Default value and convention is for this path to be sql/migrations, but it can be changed.
 */
export async function runMigrations(client: Client, databaseName: string, migrationsPath: string[] = ["sql/migrations"]) {
  await ensureDatabaseExists(client, databaseName);
  await ensureMigrationTable(client);

  const migrationsInDb = await getMigrationsDoneInDB(client)
  const migrationsScripts = await findMigrationsRelativeToCwd(migrationsPath);

  console.log('migrations scripts found', migrationsScripts);

  ensureMigrationsHaventChanged(migrationsInDb, migrationsScripts);

  const migrationsToPerform = migrationsScripts.filter(m => migrationsInDb.find(migration => migration.version === m.version) === undefined);

  for (const migration of migrationsToPerform) {
    await applyMigration(migration, client)
  }
}


function ensureMigrationsHaventChanged(migrationsInDb: MigrationDefinition[], migrationsToPerform: MigrationDefinition[]) {
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
