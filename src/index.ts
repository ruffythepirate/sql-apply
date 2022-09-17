import {connectToDb} from "./db-client-factory";
import {ensureDatabaseExists, ensureMigrationTable, getAllMigrations} from "./ensure-migration-table";

async function testRun() {
    console.log('Connecting to database...');
    const client = await connectToDb('postgres://postgres:postgres@localhost:5432/postgres',
        'postgres', 'postgres');
    console.log('Connected to database');

    const databaseName = 'test';
    await ensureDatabaseExists(client, databaseName);
    console.log('Create database to use');
    // await useDatabase(client,databaseName);
    // console.log(`Using database ${databaseName}`);
    await ensureMigrationTable(client);
    console.log('Migration table ensured');
    const migrations = await getAllMigrations(client);

    console.log(`Current migrations: ${migrations.length}`);
}

testRun().then(() => console.log('Done'));
