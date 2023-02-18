import { ensureMigrationTable } from "./MigrationDefinition";
import {Client} from 'pg';
import { populateDefaultOptions } from "../options/populate-default-options";

export async function setup(client: Client): Promise<void> {
    await client.query('BEGIN');
    await ensureMigrationTable(client, populateDefaultOptions({}));
    await client.query('COMMIT');
}

