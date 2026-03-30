import fs from 'node:fs';
import path from 'node:path';
import {QueryTypes, Sequelize} from 'sequelize';

export async function runMigrations(sequelize: Sequelize, migrationsDir: string): Promise<void> {
    await sequelize.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
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
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            await sequelize.query(statement);
        }
        await sequelize.query(
            'INSERT INTO schema_migrations (version) VALUES (?)',
            { replacements: [file] }
        );
    }
}