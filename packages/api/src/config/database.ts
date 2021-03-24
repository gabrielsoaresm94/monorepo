import { ConnectionOptions } from 'typeorm';

const databaseConfig: Partial<ConnectionOptions> = {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'postgres',
    migrations: ['dist/shared/typeorm/migrations/*.js'],
    cli: {
        migrationsDir: 'dist/shared/typeorm/migrations',
    },
    entities: ['**/*entity.js']
};

export = databaseConfig;
