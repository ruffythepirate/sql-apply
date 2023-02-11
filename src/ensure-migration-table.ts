import {Client} from "pg";
import {MigrationDefinition} from "./migration/MigrationDefinition";
const logger = require('./common/logger');

export async function ensureDatabaseExists(client: Client, databaseName: string): Promise<void> {
    const response = await client.query(`SELECT 1
                                       FROM pg_database
                                       WHERE datname = '${databaseName}'`)
    if (response.rowCount === 0) {
        await client.query(`CREATE DATABASE ${databaseName}`);
    }
}

export async function ensureMigrationTable(client: Client): Promise<void> {
    logger.info('Ensuring migration table exists');
    await client.query(`CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) NOT NULL,
        description VARCHAR ( 255 ) NOT NULL, 
        run_on TIMESTAMP NOT NULL );`)
    logger.info('Migration table now exists');
}

export async function getMigrationsDoneInDB(client: Client): Promise<MigrationDefinition[]> {
    let query = await client.query(`SELECT *
                               FROM migrations;`)
    return query.rows.map(row => new MigrationDefinition('', row.version, row.description)
}
