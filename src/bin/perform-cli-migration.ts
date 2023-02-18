import {Client} from "pg";
import {runMigrations} from "../run-migrations";
import {CliOptions, toMigrationOptions} from "./CliOptions";

export async function performCliMigration(options: CliOptions): Promise<void> {
    const client = new Client(options);
    await client.connect();

    const migrationOptions = toMigrationOptions(options);
    await runMigrations(client, [options.migrationsDir!], migrationOptions);
    await client.end();
}
