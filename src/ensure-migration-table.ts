import {Client} from "pg";
import {MigrationDefinition} from "./migration/MigrationDefinition";
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

export async function ensureMigrationTable(client: Client, migrationOptions: MigrationOptions): Promise<void> {
    logger.info('Ensuring migration table exists');
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${migrationOptions.migrationTableSchema};`);
    await client.query(`CREATE TABLE IF NOT EXISTS ${migrationOptions.migrationTableSchema}.${migrationOptions.migrationTable} (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) NOT NULL,
        description VARCHAR ( 255 ) NOT NULL, 
        run_on TIMESTAMP NOT NULL );`)
    logger.info('Migration table now exists');
}

export async function getMigrationsDoneInDB(client: Client, migrationOptions: MigrationOptions): Promise<MigrationDefinition[]> {
    const query = await client.query(`SELECT *
                               FROM ${migrationOptions.migrationTableSchema}.${migrationOptions.migrationTable};`)
    return query.rows.map(row => new MigrationDefinition('', row.version, row.description));
}
