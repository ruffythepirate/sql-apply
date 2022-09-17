import {Client} from "pg";

export async function ensureDatabaseExists(client: Client, databaseName: string) {
    const response = await client.query(`SELECT 1
                                       FROM pg_database
                                       WHERE datname = '${databaseName}'`)
    if (response.rowCount === 0) {
        await client.query(`CREATE DATABASE ${databaseName}`);
    }
}

export async function ensureMigrationTable(client: Client) {
    return await client.query(`CREATE TABLE IF NOT EXISTS migrations
    (
        id SERIAL PRIMARY KEY,
        name VARCHAR ( 255 ) NOT NULL, 
        run_on TIMESTAMP NOT NULL );`)
}

export async function getAllMigrations(client: Client) {
    return await client.query(`SELECT *
                               FROM migrations;`)
        .then((result) => result.rows);
}
