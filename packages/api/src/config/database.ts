import { ConnectionOptions } from 'typeorm';

// const PROD_ENV = 'production';

const config = {
    host: 'localhost',
    username: 'postgres', // process.env.USER,
    password: 'root', // process.env.PASS,
    database: 'postgres', // process.env.DB,
};

const databaseConfig: Partial<ConnectionOptions> = {
    name: 'default',
    type: 'postgres',
    host: config.host,
    port: 5432,
    username: config.username || 'postgres',
    password: config.password || 'root',
    database: config.database || 'postgres',
    // entities: ['dist/**/*.entity{.ts,.js}'],
    // // We are using migrations, synchronize should be set to false.
    // synchronize: false,
    // dropSchema: false,
    // // Run migrations automatically,
    // // you can disable this if you prefer running migration manually.
    // migrationsRun: true,
    // logging: ['warn', 'error'],
    // logger: process.env.NODE_ENV === PROD_ENV ? 'file' : 'debug',
    migrations: ['dist/shared/typeorm/migrations/*.js'],
    cli: {
        migrationsDir: 'dist/shared/typeorm/migrations',
    },
    // autoSchemaSync: true
};

export = databaseConfig;
