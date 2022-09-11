import {MigrationDefinition} from "./MigrationDefinition";
import * as fs from "fs";

export async function findMigrations(paths: string[]): Promise<MigrationDefinition[]> {
    if (paths.length === 0) {
        throw new Error("No path provided");
    }
    const files = await Promise.all(paths.map(path => findFilesInPath(path)));


    return files
        .flat()
        .map(file => MigrationDefinition.parseMigration(file))
        .sort((a, b) => a.version.localeCompare(b.version));
}

async function findFilesInPath(path: string): Promise<string[]>
{
    const dirEntries = fs.promises.readdir(path, {withFileTypes: true})
    const files = (await dirEntries).filter(dirent => dirent.isFile()).map(dirent => dirent.name);
    return files;
}

