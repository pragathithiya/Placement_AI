import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'database.sqlite');
const SCHEMA_PATH = path.join(process.cwd(), 'lib/schema.sql');

let db: Database.Database;

export function getDb() {
    if (!db) {
        db = new Database(DB_PATH);
        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
        db.exec(schema);
    }
    return db;
}
