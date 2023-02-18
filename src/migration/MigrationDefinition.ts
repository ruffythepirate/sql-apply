import {isNameValid} from "./name-convention";

import {logger} from '../common/logger';

import * as fs from "fs";
import {Client} from "pg";
import {MigrationOptions} from "../options/MigrationOptions";

export class MigrationDefinition {
    path: string;
    version: string;
    description: string;

    constructor(path: string, version: string, description: string) {
        this.path = path;
        this.version = version;
        this.description = description;
    }

    static parseMigration(path: string): MigrationDefinition {
        const filename = path.split("/").pop();
        if(filename === undefined || filename === '') {
           throw new Error(`Invalid path ${path}`);
        }
        if (!isNameValid(filename)) {
            throw new Error(`Invalid migration name: ${filename}`);
        }
        const [version, description] = filename.split("__");
        return new MigrationDefinition(path, version.substring(1), removeSuffix(description));
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

    async insertStatement(client: Client, migrationOptions: MigrationOptions): Promise<void> {
        const tableFullName = `${migrationOptions.migrationTableSchema}.${migrationOptions.migrationTable}`;
        console.log('inserting migration to table', tableFullName);
        await client.query(`INSERT INTO ${tableFullName} (version, description, run_on) VALUES ($1, $2, current_timestamp)`,
            [this.version, this.description]);
    }
}

export async function ensureMigrationTable(client: Client, migrationOptions: MigrationOptions): Promise<void> {
    logger.info('Ensuring migration table exists');
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${migrationOptions.migrationTableSchema};`);
    await client.query(`CREATE TABLE IF NOT EXISTS ${migrationOptions.migrationTableSchema}.${migrationOptions.migrationTable} (
        id SERIAL PRIMARY KEY,
        version VARCHAR(255) NOT NULL,
        description VARCHAR ( 255 ) NOT NULL, 
        run_on TIMESTAMP NOT NULL );`)
    logger.info('Migration table now exists');
}

export async function getMigrationsDoneInDB(client: Client, migrationOptions: MigrationOptions): Promise<MigrationDefinition[]> {
    const query = await client.query(`SELECT *
                               FROM ${migrationOptions.migrationTableSchema}.${migrationOptions.migrationTable};`)
    return query.rows.map(row => new MigrationDefinition('', row.version, row.description));
}

function removeSuffix(filename: string): string {
    return filename.substring(0, filename.lastIndexOf("."));
}
