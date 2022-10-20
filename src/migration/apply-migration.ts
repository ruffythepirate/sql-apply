const logger = require('../common/logger');
import {Client} from 'pg';
import {MigrationDefinition} from "./MigrationDefinition";

export async function applyMigration(
    migration: MigrationDefinition,
    client: Client,
): Promise<void> {

    try {
        // 1. We read the migration file
        const up = await migration.getContent();
        // 2. We create a new transaction
        client.query('BEGIN');
        
        // 5. We commit the transaction


        // 3. We execute the migration
        await client.query(up)
        logger.info('Migration applied');
        // 4. We add a record in the migration table
        await migration.insertStatement(client);
    } catch (error) {
        logger.error('Migration failed', error);
    };
}

