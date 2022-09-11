import {findMigrations} from "./migration-finder";
import {MigrationDefinition} from "./MigrationDefinition";
import * as fs from "fs";

// jest.mock("fs")

it('should throw when no path is provided', async () => {
    await expect(findMigrations([])).rejects.toThrowError("No path provided");
})

it('should return all migration files in target folder', async () => {
    fs.promises.readdir = jest.fn().mockResolvedValue(
        [
        {name: "src/migration/V1__Create_table.sql", isFile: () => true},
        {name: "src/migration/V2__Create_table.sql", isFile: () => true},
        {name: "src/migration/V3__Create_table.sql", isFile: () => true},
        ]
    )

    await expect(findMigrations(["src/migration"])).resolves.toEqual([
        new MigrationDefinition("src/migration/V1__Create_table.sql", '1', "Create_table"),
        new MigrationDefinition("src/migration/V2__Create_table.sql", '2', "Create_table"),
        new MigrationDefinition("src/migration/V3__Create_table.sql", '3', "Create_table"),
        ]);
})

it('return migrations sorted by version', async () => {
    fs.promises.readdir = jest.fn().mockResolvedValue(
        [
            {name: "src/common/V2__Create_table.sql", isFile: () => true},
        {name: "src/prod/V1__Create_table.sql", isFile: () => true},
        {name: "src/prod/V3__Create_table.sql", isFile: () => true},
        ]
    )

    await expect(findMigrations(["src/migration"])).resolves.toEqual([
        new MigrationDefinition("src/prod/V1__Create_table.sql", '1', "Create_table"),
        new MigrationDefinition("src/common/V2__Create_table.sql", '2', "Create_table"),
        new MigrationDefinition("src/prod/V3__Create_table.sql", '3', "Create_table"),
        ]);
})