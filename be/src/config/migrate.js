import fs from "fs";
import path from "path";
import { db } from "./db.js";

export const startMigration = async() => {
    const migrationsPath = path.resolve("src/migrations");
    const files = fs.readdirSync(migrationsPath).sort();

    await db.query("CREATE TABLE IF NOT EXISTS migrations(id BIGSERIAL PRIMARY KEY, filename VARCHAR(255) NOT NULL)")

    for(const file of files){
        const result = await db.query("SELECT * FROM migrations WHERE filename = $1", [file])
        if(result.rows.length > 0){
            continue;
        }
        const sql = fs.readFileSync(
            path.join(migrationsPath, file), "utf8"
        )

        await db.query(sql);
        await db.query("INSERT INTO migrations(filename) VALUES($1)", [file])
        console.log(`migrations executed ${file}`);
    }
}