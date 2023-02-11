import {MigrationDefinition} from "./MigrationDefinition";
import * as fs from "fs";


/**
 * Finds all of the migrations in the given paths. The paths are relative to the current working directory and should not start with a /.
 * For example 'sql/migrations' is a valid path, but '/sql/migrations' is not.
 */
export async function findMigrationsRelativeToCwd(paths: string[]): Promise<MigrationDefinition[]> {
    const absolutePaths = paths.map(path => `${process.cwd()}/${path}`);
    return findMigrationsAbsolutPaths(absolutePaths);
}

/**
 * Finds all of the migrations in the given paths. The paths are absolute and should start with a /.
 */
export async function findMigrationsAbsolutPaths(paths: string[]): Promise<MigrationDefinition[]> {
    if (paths.length === 0) {
        throw new Error("No path provided");
    }
    const files = await Promise.all(paths.map(path => findFilesInPath(path).then(files => files.map(file => `${path}/${file}`))));

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

