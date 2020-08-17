import { NextFunction, Request, Response } from 'express';
import { getStatusText, OK } from 'http-status-codes';

/**
 * @description responseModule middleware injects a response object to the api
 * @param _
 * @param {Response} response
 * @param {NextFunction} next
 */
export function responseModule(_: Request, response: Response, next: NextFunction) {
    response.responseModule = ({ message, data, status = OK }) => {
        const responseMessage = message || getStatusText[status];
        response.status(status);

        response.send({
            VERSION: response.locals.version || 'V1',
            statusCode: status,
            message: responseMessage,
            data
        });
    };
    next();
}

export default responseModule;
