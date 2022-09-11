import {findMigrations} from "./migration-finder";
import {MigrationDefinition} from "./MigrationDefinition";

it('should throw when no path is provided', async () => {
    await expect(findMigrations([])).rejects.toThrowError("No path provided");
})

// it('should return all migration files in target folder', async () => {

    // await expect(findMigrations(["src/migration"])).resolves.toEqual([
    //     new MigrationDefinition("src/migration/V1__Create_table.sql", 1, "Create_table"),
    //     new MigrationDefinition("src/migration/V2__Create_table.sql", 2, "Create_table"),
    //     new MigrationDefinition("src/migration/V3__Create_table.sql", 3, "Create_table"),
    //     ]);
// })