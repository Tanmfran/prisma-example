import {Client} from 'pg';

const databaseName = "mydb";

// Configuration for connecting to the default database,
// usually "postgres" or another database with permissions to create new databases
const client = new Client({
    user: 'tannor',
    host: 'localhost',
    password: 'postgres',
    port: 5432,
    database: 'postgres' // default maintenance DB
});

export async function createDatabase() {
    try {
        await client.connect(); // connect to the default database
        const dbExists = await client.query(`SELECT 1 FROM pg_database WHERE datname='${databaseName}'`);
        if (dbExists.rowCount === 0) {
            await client.query(`CREATE DATABASE "${databaseName}"`);
            console.log(`Database ${databaseName} created.`);
        } else {
            console.log(`Database ${databaseName} already exists.`);
        }
    } catch (error) {
        console.error("Could not create database", error);
    } finally {
        await client.end(); // close the connection
    }
}
