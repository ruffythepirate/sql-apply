import { findMigrationsRelativeToCwd } from "./migration-finder";

describe("findMigrationsRelativeToCwd", () => {
    it("should find migrations", async () => {
        const migrations = await findMigrationsRelativeToCwd(["example-migrations/dev"]);
        expect(migrations.length).toBe(1);
        expect(migrations[0].path).toContain("example-migrations/dev/V1__Create_table.sql");
    });
});
