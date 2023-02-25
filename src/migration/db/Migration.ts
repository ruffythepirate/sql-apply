import {Client} from 'pg';
import {logger} from '../../common/logger';
import {MigrationOptions} from '../../options/MigrationOptions';
export class Migration {
    id?: number;
    version: string;
    description: string;
    fileHash: string;

    constructor(id: number | undefined, version: string, description: string, fileHash: string) {
        this.id = id;
        this.version = version;
        this.description = description;
        this.fileHash = fileHash;
    }
}

export async function insertMigration(client: Client, migration: Migration, migrationOptions: MigrationOptions): Promise<void> {
        const tableFullName = `${migrationOptions.migrationTableSchema}.${migrationOptions.migrationTable}`;
        await client.query(`INSERT INTO ${tableFullName} (version, description, run_on) VALUES ($1, $2, current_timestamp)`,
            [migration.version, migration.description]);
}

export async function ensureMigrationTable(client: Client, migrationOptions: MigrationOptions): Promise<void> {
    logger.info('Ensuring migration table exists');
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${migrationOptions.migrationTableSchema};`);
    await client.query(`CREATE TABLE IF NOT EXISTS ${migrationOptions.migrationTableSchema}.${migrationOptions.migrationTable} (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) NOT NULL UNIQUE,
        description VARCHAR ( 255 ) NOT NULL, 
        run_on TIMESTAMP NOT NULL );`)

    await client.query(`ALTER TABLE ${migrationOptions.migrationTableSchema}.${migrationOptions.migrationTable} DROP CONSTRAINT IF EXISTS ${migrationOptions.migrationTable}_version_key;`)
    await client.query(`ALTER TABLE ${migrationOptions.migrationTableSchema}.${migrationOptions.migrationTable} ADD CONSTRAINT ${migrationOptions.migrationTable}_version_key UNIQUE (version);`)

    await client.query(`ALTER TABLE  ${migrationOptions.migrationTableSchema}.${migrationOptions.migrationTable} ADD COLUMN IF NOT EXISTS migration_file_hash VARCHAR(64);`);

    logger.info('Migration table now exists');
}

export async function getMigrationsDoneInDB(client: Client, migrationOptions: MigrationOptions): Promise<Migration[]> {
    const query = await client.query(`SELECT *
                               FROM ${migrationOptions.migrationTableSchema}.${migrationOptions.migrationTable};`);
    return query.rows.map(row => new Migration(row.id, row.version, row.description, row.migration_file_hash));
}

function removeSuffix(filename: string): string {
    return filename.substring(0, filename.lastIndexOf("."));
}
