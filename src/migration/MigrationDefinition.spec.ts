import {MigrationDefinition} from "./MigrationDefinition";

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
    expect(migration.version).toBe(1);
    expect(migration.description).toBe("Create_table");
});