import {logger} from '../common/logger';
import {Client} from 'pg';
import {MigrationOptions} from '../options/MigrationOptions';
import {createMigration, MigrationPointer} from "./MigrationPointer";
import {setup} from "./setup";
import {insertMigration} from './db/Migration';

export async function applyMigration(
    migrationPointer: MigrationPointer,
    client: Client,
    migrationOptions: MigrationOptions
): Promise<void> {

    try {
        await setup(client);

        logger.info(`Applying migrationPointer ${migrationPointer.version} - ${migrationPointer.description}. File path: ${migrationPointer.path}`);
        // 1. We read the migrationPointer file
        const up = await migrationPointer.getContent();
        // 2. We create a new transaction
        client.query('BEGIN');
        
        // 5. We commit the transaction
        logger.info(`Getting ready to apply script ${up}`);


        // 3. We execute the migrationPointer
        await client.query(up)
        logger.info('Migration applied');

        // 4. We add a record in the migrationPointer table
        const migration = await createMigration(migrationPointer);
        await insertMigration(client, migration, migrationOptions);

        logger.info('Committing transaction');
        await client.query('COMMIT');
    } catch (error) {
        logger.error(`Migration failed: ${error}`);
        await client.query('ROLLBACK');
        throw error;
    }
}

