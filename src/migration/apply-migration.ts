import logger = require('../common/logger');
import {Client} from 'pg';
import {MigrationDefinition} from "./MigrationDefinition";
import {setup} from "./setup";

export async function applyMigration(
    migration: MigrationDefinition,
    client: Client,
): Promise<void> {

    try {
        await setup(client);

        logger.info(`Applying migration ${migration.version} - ${migration.description}`);
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
        await migration.insertStatement(client);

        logger.info('Committing transaction');
        client.query('COMMIT');
    } catch (error) {
        logger.error('Migration failed', error);
        client.query('ROLLBACK');
    }
}

