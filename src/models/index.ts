/* eslint-disable @typescript-eslint/no-var-requires */
import { logger } from '+utils';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
import * as sequelizeConfig from '+core/database/sequelize_config/database';

const environment = process.env.NODE_ENV || 'development';

const config = sequelizeConfig[environment];

const { database, username, password, ...otherConfig } = config;

const sequelize = new Sequelize(database, username, password, {
    logging: (msg) => logger.debug(msg),
    ...otherConfig
});

export default sequelize;
