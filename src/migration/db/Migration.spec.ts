import {Client} from "pg";
import {populateDefaultOptions} from "../../options/populate-default-options";
import {ensureMigrationTable, getMigrationsDoneInDB, insertMigration, Migration} from "./Migration";

const migration = new Migration(undefined, "2", "hello", "hash");

it('should perform insert statement', () => {
    const client = {
        query: jest.fn()
    } as unknown as Client;
    insertMigration(client, migration, populateDefaultOptions({}));
    expect(client.query).toBeCalledTimes(1);
});

it('should ensure that migration table exists', async () => {
    const client = {
        query: jest.fn().mockResolvedValue({rows: []})
    } as unknown as Client;
    await ensureMigrationTable(client, populateDefaultOptions({}));
    expect(client.query).toBeCalledTimes(5);
});

it('should get done migrations', async () => {
    const client = {
        query: jest.fn().mockResolvedValue({rows: [migration]})
    } as unknown as Client;

    const doneMigrations = await getMigrationsDoneInDB(client, populateDefaultOptions({}));
    expect(doneMigrations.length).toEqual(1);
});
