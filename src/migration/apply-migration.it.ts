import { 
  StartedTestContainer, 
  GenericContainer
} from "testcontainers";

import { MigrationDefinition } from "./MigrationDefinition";
import {Client} from "pg";

import { applyMigration } from "./apply-migration";
import {populateDefaultOptions} from "../options/populate-default-options";
import {ensureMigrationTable} from "../ensure-migration-table";

describe("Apply migration", () => {
    const logger = require("../common/logger");

  let client: Client;
  let container: StartedTestContainer;

  let databaseCredentials: any;

  jest.setTimeout(50000);

  beforeAll(async () => {
    container = await new GenericContainer("postgres:12.0")
      .withExposedPorts(5432)
      .start();

    const host = "127.0.0.1";
    const port = container.getMappedPort(5432);
    const databaseCredentials = {
      host,
      port,
      user: "postgres",
      password: "postgres",
      database: "postgres"
    };

    client = new Client(databaseCredentials);
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
    await container.stop();
  });


    it('should apply migration', async () => {
        const migrationOptions = populateDefaultOptions({});

        const migration = MigrationDefinition.parseMigration("./example-migrations/dev/V1__Create_table.sql")
        await applyMigration(migration, client, migrationOptions);

        const result = await client.query('SELECT * FROM migrations');
        expect(result.rows).toHaveLength(1);
        expect(result.rows[0].version).toBe('1');
        expect(result.rows[0].description).toBe('Create_table');
        expect(result.rows[0].run_on).not.toBe(null);
        expect(result.rows[0].run_on).not.toBe(undefined);
        expect(result.rows[0].run_on).not.toBe('');

    });

    it('should apply migration to custom schema', async () => {
        const migrationOptions = populateDefaultOptions({
            migrationTableSchema: 'test',
            migrationTable: 'testmigrations'
        });

        await ensureMigrationTable(client, migrationOptions);

        const migration = MigrationDefinition.parseMigration("./example-migrations/custom/V1__Create_custom.sql")
        await applyMigration(migration, client, migrationOptions);

        const result = await client.query('SELECT * FROM test.testmigrations');
        expect(result.rows).toHaveLength(1);
        expect(result.rows[0].version).toBe('1');
        expect(result.rows[0].description).toBe('Create_custom');
        expect(result.rows[0].run_on).not.toBe(null);
        expect(result.rows[0].run_on).not.toBe(undefined);
        expect(result.rows[0].run_on).not.toBe('');

    });
});
