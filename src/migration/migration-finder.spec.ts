import {findMigrationsRelativeToCwd} from "./migration-finder";
import {MigrationDefinition} from "./MigrationDefinition";
import * as fs from "fs";

// jest.mock("fs")

it('should throw when no path is provided', async () => {
    await expect(findMigrationsRelativeToCwd([])).rejects.toThrowError("No path provided");
})

it('should return all migration files in target folder', async () => {
    fs.promises.readdir = jest.fn().mockResolvedValue(
        [
        {name: "V1__Create_table.sql", isFile: () => true},
        {name: "V2__Create_table.sql", isFile: () => true},
        {name: "V3__Create_table.sql", isFile: () => true},
        ]
    )

    await expect(findMigrationsRelativeToCwd(["src/migration"])).resolves.toEqual([
        new MigrationDefinition(absolutePath("src/migration/V1__Create_table.sql"), '1', "Create_table"),
        new MigrationDefinition(absolutePath("src/migration/V2__Create_table.sql"), '2', "Create_table"),
        new MigrationDefinition(absolutePath("src/migration/V3__Create_table.sql"), '3', "Create_table"),
        ]);
})

it('return migrations sorted by version', async () => {
    fs.promises.readdir = jest.fn().mockResolvedValue(
        [
            {name: "V2__Create_table.sql", isFile: () => true},
        {name: "V1__Create_table.sql", isFile: () => true},
        {name: "V3__Create_table.sql", isFile: () => true},
        ]
    )

    await expect(findMigrationsRelativeToCwd(["src"])).resolves.toEqual([
        new MigrationDefinition(absolutePath("src/V1__Create_table.sql"), '1', "Create_table"),
        new MigrationDefinition(absolutePath("src/V2__Create_table.sql"), '2', "Create_table"),
        new MigrationDefinition(absolutePath("src/V3__Create_table.sql"), '3', "Create_table"),
        ]);
})

function absolutePath(path: string) {

    return `${process.cwd()}/${path}`;
}
