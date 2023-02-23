import * as fs from "fs";
import {Migration} from "./db/Migration";
import {createMigration, MigrationPointer} from "./MigrationPointer";

it(`should throw when path is invalid`, () => {
    expect(() => MigrationPointer.parseMigration("")).toThrowError("Invalid path");
});

it(`should throw when filename is invalid`, () => {
    expect(() => MigrationPointer.parseMigration("src/migration/V1_Create_table.sql")).toThrowError("Invalid migration name");
});

it(`should parse valid filename`, () => {
    const path = "src/migration/V1__Create_table.sql"
    const migration = MigrationPointer.parseMigration(path);
    expect(migration.path).toBe(path);
    expect(migration.version).toBe('1');
    expect(migration.description).toBe("Create_table");
});

it('should return true if file exists', () => {
    const path = "src/migration/V1__Create_table.sql"
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Promise.resolve("content"));
    const migration = MigrationPointer.parseMigration(path);
    expect(migration.verifyExists()).resolves.toBe(true);
})

it('should return false if file doesnt exists', () => {
    const path = "src/migration/V1__Create_table.sql"
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Promise.reject("failure"));
    const migration = MigrationPointer.parseMigration(path);
    expect(migration.verifyExists()).resolves.toBe(false);
})

it('should return content of file', () => {
    const path = "src/migration/V1__Create_table.sql"
    jest.spyOn(fs.promises, 'readFile').mockResolvedValue(Promise.resolve("content"));
    const migration = MigrationPointer.parseMigration(path);
    expect(migration.getContent()).resolves.toBe("content");
})

it('should convert a migration pointer to a migration', async () => {
    const path = "example-migrations/dev/V1__Create_table.sql"
    const pointer = MigrationPointer.parseMigration(path);
    const migration = await createMigration(pointer);

    expect(migration).toMatchObject({
        version: "1",
        description: "Create_table",
    });
});
