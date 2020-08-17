import dotenv from 'dotenv';

dotenv.config();
const sequelizeConfig = {
    host: process.env.DATABASE_HOST || '127.0.0.1',
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DATABASE_NAME || 'fueled_backend',
    port: process.env.DATABASE_PORT || '5432',
    'migrations-path': './src/core/database/migrations',
    'seeders-path': './src/core/database/seeders',
    dialect: 'postgres',
    logging: process.env.SHOW_SQL_LOGS || false
};

export const development = { ...sequelizeConfig };

export const test = {
    ...sequelizeConfig,
    username: process.env.TEST_DATABASE_USERNAME || sequelizeConfig.username,
    password: process.env.TEST_DATABASE_PASSWORD || sequelizeConfig.password,
    database: process.env.TEST_DATABASE_NAME || `${sequelizeConfig.database}_test`,
    logging: false
};

export const production = { ...sequelizeConfig, logging: false };
