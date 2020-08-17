import { GenericException } from '+core/exceptions';
import { ValidationErrorResult } from '+interfaces/ValidationErrorResult';
import { NextFunction, Request, Response } from 'express';
import { BAD_REQUEST, getStatusText, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { ValidationError, ValidationErrorItem, DatabaseError } from 'sequelize';

import logger from './logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (error: Error, _: Request, response: Response, _next: NextFunction) => {
    // TODO (Fidelis): fix error handler to handle mongo errors
    let errorData = {
        VERSION: response.locals.version || 'V1',
        statusCode: INTERNAL_SERVER_ERROR,
        name: 'UnhandledException',
        message: getStatusText(INTERNAL_SERVER_ERROR),
        data: {}
    };

    if (error instanceof GenericException) {
        errorData = { ...errorData, ...error.formatError() };
    }

    if (error instanceof DatabaseError) {
        const data = {
            global: error.message
        };
        if (error.message.includes('invalid input syntax')) {
            errorData.statusCode = BAD_REQUEST;
        }
        errorData = {
            ...errorData,
            name: 'DatabaseError',
            message: error.message,
            data
        };
    }

    if (error instanceof ValidationError) {
        const data = error.errors.reduce((result: ValidationErrorResult, currentError: ValidationErrorItem) => {
            if (!result.hasOwnProperty(currentError.path)) {
                result[currentError.path] = [];
            }
            result[currentError.path].push(currentError.message);
            return result;
        }, {});

        errorData = {
            ...errorData,
            name: 'ValidationError',
            statusCode: BAD_REQUEST,
            message: error.message,
            data
        };
    }

    logger.error(error);

    return response.status(errorData.statusCode).send({
        ...errorData
    });
};

export default errorHandler;
