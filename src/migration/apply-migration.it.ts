import { 
  TestContainer, 
  StartedTestContainer, 
  StoppedTestContainer, 
  GenericContainer
} from "testcontainers";

import { MigrationDefinition } from "./MigrationDefinition";
import {Client} from "pg";

import { applyMigration } from "./apply-migration";

const logger = require('../common/logger');

let startedContainer: StartedTestContainer

beforeAll(async () => {
    logger.info('Starting container');
    
    startedContainer = await new GenericContainer("postgres:15-alpine")
                            .withExposedPorts(5432)
                            .withEnv("POSTGRES_PASSWORD", "password")   
                            .withEnv("POSTGRES_USER", "user")
                            .withName("postgres-random-me")
                            .start();

    logger.info('Container started');
});

afterAll(async () => {
    if(startedContainer) {
        logger.info('Stopping container');
        await startedContainer.stop();
        logger.info('Container stopped');
    }
});


it('should apply migration', async () => {

    const client = new Client({
        user: 'user',
        host: 'localhost',
        database: 'postgres',
        password: 'password',
        port: startedContainer.getMappedPort(5432),
    });
    await client.connect();

    const migration = MigrationDefinition.parseMigration("./example-migrations/dev/V1__Create_table.sql")
    await applyMigration(migration, client);

    const result = await client.query('SELECT * FROM migration');
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].version).toBe('1');
    expect(result.rows[0].description).toBe('Create_table');
    expect(result.rows[0].applied_at).not.toBe(null);
    expect(result.rows[0].applied_at).not.toBe(undefined);
    expect(result.rows[0].applied_at).not.toBe('');

    await client.end();
});
