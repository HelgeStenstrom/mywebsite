import fs from 'node:fs';
import path from 'node:path';
import {QueryTypes, Sequelize} from 'sequelize';

export async function runMigrations(sequelize: Sequelize, migrationsDir: string): Promise<void> {
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

    const applied = await sequelize.query<{ version: string }>(
        'SELECT version FROM schema_migrations',
        { type: QueryTypes.SELECT }
    );
    const appliedVersions = new Set(applied.map(r => r.version));

    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        if (appliedVersions.has(file)) continue;

        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        await sequelize.query(sql);
        await sequelize.query(
            'INSERT INTO schema_migrations (version) VALUES (?)',
            { replacements: [file] }
        );
    }
}