import {logger} from '../common/logger';
import {Client} from 'pg';
import {MigrationOptions} from '../options/MigrationOptions';
import {MigrationPointer} from "./MigrationPointer";
import {setup} from "./setup";

export async function applyMigration(
    migration: MigrationPointer,
    client: Client,
    migrationOptions: MigrationOptions
): Promise<void> {

    try {
        await setup(client);

        logger.info(`Applying migration ${migration.version} - ${migration.description}. File path: ${migration.path}`);
        // 1. We read the migration file
        const up = await migration.getContent();
        // 2. We create a new transaction
        client.query('BEGIN');
        
        // 5. We commit the transaction
        logger.info(`Getting ready to apply script ${up}`);


        // 3. We execute the migration
        await client.query(up)
        logger.info('Migration applied');
        // 4. We add a record in the migration table
        await migration.insertStatement(client, migrationOptions);

        logger.info('Committing transaction');
        await client.query('COMMIT');
    } catch (error) {
        logger.error(`Migration failed: ${error}`);
        await client.query('ROLLBACK');
        throw error;
    }
}

