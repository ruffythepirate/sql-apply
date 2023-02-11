import { Client } from "pg";
import { runMigrations } from "./run-migrations";
import { GenericContainer, StartedTestContainer } from "testcontainers";

describe("Flyway Migration", () => {
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

  it("creates the Persons table", async () => {
    await runMigrations(client, 'postgres', ['example-migrations/dev']);

    const result = await client.query("SELECT * FROM information_schema.tables where table_name = 'persons'");
    expect(result.rows.length).toBe(1);
  });
});


