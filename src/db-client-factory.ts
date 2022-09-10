import {Client} from "pg";
import exp from "constants";

export async function connectToDb(databaseUrl: string, username: string, password: string) {
  const client = new Client({
    connectionString: databaseUrl,
    user: username,
    password: password,
    ssl: false,
  });
  await client.connect();
  return client;
}
