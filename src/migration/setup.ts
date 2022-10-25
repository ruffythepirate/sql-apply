import { ensureMigrationTable } from "../ensure-migration-table";
import {Client} from 'pg';

export async function setup(client: Client): Promise<void> {
    await client.query('BEGIN');
    await ensureMigrationTable(client);
    await client.query('COMMIT');
}

