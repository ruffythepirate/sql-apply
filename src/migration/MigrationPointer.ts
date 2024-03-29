import {isNameValid} from "./name-convention";
import * as fs from "fs";
import {Migration} from "./db/Migration";
import {sha256HashContent} from "./hash-service";

export class MigrationPointer {
    path: string;
    version: string;
    description: string;

    constructor(path: string, version: string, description: string) {
        this.path = path;
        this.version = version;
        this.description = description;
    }

    static parseMigration(path: string): MigrationPointer {
        const filename = path.split("/").pop();
        if(filename === undefined || filename === '') {
           throw new Error(`Invalid path ${path}`);
        }
        if (!isNameValid(filename)) {
            throw new Error(`Invalid migration name: ${filename}`);
        }
        const [version, description] = filename.split("__");
        return new MigrationPointer(path, version.substring(1), removeSuffix(description));
    }

    async verifyExists(): Promise<boolean> {
        try {
            await fs.promises.readFile(this.path);
            return true;
        } catch( e ) {
            return false;
        }
    }

    async getContent(): Promise<string> {
        return await fs.promises.readFile(this.path).then(r => r.toString());
    }
}

export async function createMigration(pointer: MigrationPointer): Promise<Migration> {
    const content = await pointer.getContent();
    const hash = await sha256HashContent(content);
    return new Migration(undefined, pointer.version, pointer.description, hash);
}

function removeSuffix(filename: string): string {
    return filename.substring(0, filename.lastIndexOf("."));
}
