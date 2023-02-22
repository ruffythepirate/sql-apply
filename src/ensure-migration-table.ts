import {Client} from "pg";
import {MigrationPointer} from "./migration/MigrationPointer";
import {MigrationOptions} from "./options/MigrationOptions";
const logger = require('./common/logger');

export async function ensureDatabaseExists(client: Client, databaseName: string): Promise<void> {
    const response = await client.query(`SELECT 1
                                       FROM pg_database
                                       WHERE datname = '${databaseName}'`)
    if (response.rowCount === 0) {
        await client.query(`CREATE DATABASE ${databaseName}`);
    }
}

