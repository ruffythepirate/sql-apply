import {Client} from "pg";
import {GenericContainer, StartedTestContainer} from "testcontainers";
import {ensureMigrationTable} from "./MigrationDefinition";
import {populateDefaultOptions} from "../options/populate-default-options";

describe("Ensure migration table", () => {
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

  it('should ensure migration table exists', async () => {
    await client.query('BEGIN');
    await ensureMigrationTable(client, populateDefaultOptions({}));
    await client.query('COMMIT');

    const migrations = await client.query('SELECT * FROM migrations');
    expect(migrations.rows).toEqual([]);
  });

  it('should ensure migration table exists with custom schema', async () => {
    await client.query('BEGIN');
    await ensureMigrationTable(client, populateDefaultOptions({ migrationTableSchema: 'test', migrationTable: 'testmigrations' }));
    await client.query('COMMIT');

    const migrations = await client.query('SELECT * FROM test.testmigrations');
    expect(migrations.rows).toEqual([]);
  });
});
