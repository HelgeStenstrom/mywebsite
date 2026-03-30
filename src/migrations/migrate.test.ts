//noinspection SqlResolve
//noinspection SqlNoDataSourceInspection
import {Sequelize} from 'sequelize';
import path from 'path';
import os from 'os';
import fs from 'fs';
import {runMigrations} from './migrate';

function makeTestDb(): Sequelize {
    return new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
}

function makeTempMigrationsDir(files: Record<string, string>): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'migrations-'));
    for (const [name, content] of Object.entries(files)) {
        fs.writeFileSync(path.join(dir, name), content);
    }
    return dir;
}

describe('runMigrations', () => {

    test('creates schema_migrations table if it does not exist', async () => {
        const db = makeTestDb();
        const dir = makeTempMigrationsDir({});
        await runMigrations(db, dir);
        // language=None
        const [rows] = await db.query("SELECT name FROM sqlite_master WHERE name = 'schema_migrations'");
        expect(rows).toHaveLength(1);
    });

    test('runs a migration and registers it', async () => {
        const db = makeTestDb();
        const dir = makeTempMigrationsDir({
            '001_create_foo.sql': 'CREATE TABLE foo (id INTEGER PRIMARY KEY)'
        });
        await runMigrations(db, dir);
        // language=None
        const [tables] = await db.query("SELECT name FROM sqlite_master WHERE name = 'foo'");
        expect(tables).toHaveLength(1);
        const applied = await db.query<{ version: string }>(
        // @ts-ignore
            'SELECT version FROM schema_migrations', { type: 'SELECT' }
        );
        // @ts-ignore
        expect(applied.map(r => r.version)).toEqual(['001_create_foo.sql']);
    });

    test('does not run the same migration twice', async () => {
        const db = makeTestDb();
        const dir = makeTempMigrationsDir({
            '001_create_foo.sql': 'CREATE TABLE foo (id INTEGER PRIMARY KEY)'
        });
        await runMigrations(db, dir);
        await runMigrations(db, dir); // andra körningen ska inte krascha
        const applied = await db.query<{ version: string }>(
        // @ts-ignore
            'SELECT version FROM schema_migrations', { type: 'SELECT' }
        );
        expect(applied).toHaveLength(1);
    });

    test('runs migrations in alphabetical order', async () => {
        const db = makeTestDb();
        const dir = makeTempMigrationsDir({
            '002_add_bar.sql': 'ALTER TABLE foo ADD COLUMN bar TEXT',
            '001_create_foo.sql': 'CREATE TABLE foo (id INTEGER PRIMARY KEY)'
        });
        await runMigrations(db, dir);
        const applied = await db.query<{ version: string }>(
        // @ts-ignore
            'SELECT version FROM schema_migrations ORDER BY applied_at', { type: 'SELECT' }
        );
        // @ts-ignore
        expect(applied.map(r => r.version)).toEqual([
            '001_create_foo.sql',
            '002_add_bar.sql'
        ]);
    });

    test('only runs new migrations on second run', async () => {
        const db = makeTestDb();
        const dir = makeTempMigrationsDir({
            '001_create_foo.sql': 'CREATE TABLE foo (id INTEGER PRIMARY KEY)'
        });
        await runMigrations(db, dir);

        fs.writeFileSync(
            path.join(dir, '002_add_bar.sql'),
            'ALTER TABLE foo ADD COLUMN bar TEXT'
        );
        await runMigrations(db, dir);

        const applied = await db.query<{ version: string }>(
        // @ts-ignore
            'SELECT version FROM schema_migrations', { type: 'SELECT' }
        );
        expect(applied).toHaveLength(2);
    });

});

