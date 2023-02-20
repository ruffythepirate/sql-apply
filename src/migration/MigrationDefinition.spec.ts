import {ensureMigrationTable, getMigrationsDoneInDB, MigrationDefinition} from "./MigrationDefinition";
import {Client} from "pg";

import * as fs from "fs";
import {populateDefaultOptions} from "../options/populate-default-options";

it(`should throw when path is invalid`, () => {
    expect(() => MigrationDefinition.parseMigration("")).toThrowError("Invalid path");
});

it(`should throw when filename is invalid`, () => {
    expect(() => MigrationDefinition.parseMigration("src/migration/V1_Create_table.sql")).toThrowError("Invalid migration name");
});

it(`should parse valid filename`, () => {
    const path = "src/migration/V1__Create_table.sql"
    const migration = MigrationDefinition.parseMigration(path);
    expect(migration.path).toBe(path);
    expect(migration.version).toBe('1');
    expect(migration.description).toBe("Create_table");
});

it('should return true if file exists', () => {
    const path = "src/migration/V1__Create_table.sql"
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Promise.resolve("content"));
    const migration = MigrationDefinition.parseMigration(path);
    expect(migration.verifyExists()).resolves.toBe(true);
})

it('should return false if file doesnt exists', () => {
    const path = "src/migration/V1__Create_table.sql"
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Promise.reject("failure"));
    const migration = MigrationDefinition.parseMigration(path);
    expect(migration.verifyExists()).resolves.toBe(false);
})

it('should return content of file', () => {
    const path = "src/migration/V1__Create_table.sql"
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Promise.resolve("content"));
    const migration = MigrationDefinition.parseMigration(path);
    expect(migration.getContent()).resolves.toBe("content");
})

it('should perform insert statement', () => {
    const path = "src/migration/V1__Create_table.sql"
    const migration = MigrationDefinition.parseMigration(path);
    const client = {
        query: jest.fn()
    } as unknown as Client;
    migration.insertStatement(client, populateDefaultOptions({}));
    expect(client.query).toBeCalledTimes(1);
});

it('should ensure that migration table exists', async () => {
    const path = "src/migration/V1__Create_table.sql"
    const migration = MigrationDefinition.parseMigration(path);
    const client = {
        query: jest.fn().mockResolvedValue({rows: []})
    } as unknown as Client;
    await ensureMigrationTable(client, populateDefaultOptions({}));
    expect(client.query).toBeCalledTimes(2);
});

it('should get done migrations', async () => {
    const path = "src/migration/V1__Create_table.sql"
    const migration = MigrationDefinition.parseMigration(path);
    const client = {
        query: jest.fn().mockResolvedValue({rows: [migration]})
    } as unknown as Client;
    const doneMigrations = await getMigrationsDoneInDB(client, populateDefaultOptions({}));
    expect(doneMigrations.length).toEqual(1);
});
