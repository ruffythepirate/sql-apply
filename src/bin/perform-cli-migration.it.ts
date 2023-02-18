import {Client} from "pg";
import {GenericContainer, StartedTestContainer} from "testcontainers";
import {withDefaultOptions} from "./CliOptions";
import {performCliMigration} from "./perform-cli-migration";

describe('perform-cli-migration', () => {

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
    databaseCredentials = {
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

  it('should migrate', async () => {
    const options = withDefaultOptions(databaseCredentials);
    options.migrationsDir = 'example-migrations/dev';
    await performCliMigration(options);

    const result = await client.query('SELECT * FROM public.persons');
    expect(result.rows).toEqual([]);
  });

});
