import { Restaurants } from '+controllers';
import sequelize from '+models';
import { errorHandler, logger, notFound, responseModule } from '+utils';
import compression from 'compression';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import http, { Server } from 'http';
import morgan from 'morgan';
import { Sequelize } from 'sequelize';
import swaggerUI from 'swagger-ui-express';
import swaggerDoc from './swaggerdoc.json';

dotenv.config();
export class Application {
    private startHandlers: Function[] = [];
    private shutdownHandlers: Function[] = [];
    public database?: Sequelize;
    public server?: Server;

    public app: express.Application = express();

    public onStart(handler: Function) {
        this.startHandlers.push(handler);
    }

    public onShutdown(handler: Function) {
        this.shutdownHandlers.push(handler);
    }

    public async start() {
        // quit on ctrl-c when running docker in terminal
        process.on('SIGINT', () => {
            logger.error(`Got SIGINT. Graceful shutdown ${new Date().toISOString()}`);
            this.shutdown();
        });
        // quit properly on docker stop
        process.on('SIGTERM', () => {
            logger.error(`Got SIGTERM. Graceful shutdown ${new Date().toISOString()}`);
            this.shutdown();
        });

        logger.info(`Starting Service`);
        await this.configureDb();
        await this.configureServer();

        this.configureExpress();

        this.startHandlers.forEach(async (handler) => await handler());
    }

    public async shutdown() {
        logger.info('Shutting down Service.');

        if (this.database) {
            await this.database.close();
            logger.info('Database disconnected.');
        }

        if (this.server) {
            await this.server.close();
            logger.info('Express server stopped.');
        }

        await Promise.all(this.shutdownHandlers.map((handler) => handler()))
            .then((results) => results.forEach((message) => logger.log(message)))
            .then(() => logger.info(`Service stopped!`))
            .catch((error: Error) => {
                logger.error(error);
                process.exit(1);
            });
    }

    private async configureDb(): Promise<void> {
        try {
            this.database = sequelize;
            logger.info('Database connected.');
        } catch (err) {
            this.shutdown();
            logger.error('Database connection failure ', err.message || err);
        }
    }

    private onHealthCheck() {
        return async (_req: Request, response: Response) => {
            const statuses = {
                database: {
                    status: 'OK'
                },
                service: {
                    status: 'OK',
                    uptime: process.uptime()
                },
                healthy: true
            };

            if (!this.database) {
                statuses.database.status = 'db not connected.';
                statuses.healthy = false;
            }

            try {
                await this.database?.authenticate();
            } catch (error) {
                statuses.healthy = false;
                statuses.database.status = error.message;
            }

            logger.debug('Healthcare called: ', statuses);

            response.status(200).json(statuses);
        };
    }

    private configureServer() {
        this.app.use(compression());
        this.app.use(helmet());
        this.app.use(express.json({ type: 'application/json' }));
        this.app.use(express.urlencoded({ extended: false }));

        if (process.env.NODE_ENV !== 'test') {
            this.app.use(
                morgan('combined', {
                    skip: (request) => (request.baseUrl || request.originalUrl).includes('healthcheck'),
                    stream: { write: (message: string) => logger.info(message) }
                })
            );
        }
        this.server = http.createServer(this.app);

        const port = this.normalizePort(process.env.SERVER_PORT || '3000');
        this.server.listen(port);
        logger.info('Express server started.');
    }

    private configureExpress() {
        this.app.use(responseModule);
        this.app.use('/healthcheck', this.onHealthCheck());
        this.app.use('/v1/:userId/restaurants', Restaurants);
        this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
        this.app.use(notFound);
        this.app.use(errorHandler);
    }

    private normalizePort(val: string): number | boolean | string {
        const port = parseInt(val, 10);

        if (Number.isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }
}

export default new Application();
