import { ConnectionOptions } from 'typeorm';

const databaseConfig: Partial<ConnectionOptions> = {
    name: 'default',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.USER_NAME,
    password: process.env.PASS,
    database: process.env.DB,
    migrations: ['dist/shared/typeorm/migrations/*.js'],
    cli: {
        migrationsDir: 'dist/shared/typeorm/migrations',
    },
    entities: ['**/*entity.js']
};

export = databaseConfig;
