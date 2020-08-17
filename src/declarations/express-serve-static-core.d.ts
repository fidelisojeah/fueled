import 'express-serve-static-core';

interface IResponse {
    message?: string;
    data?: any;
    status?: any;
}

declare module 'express-serve-static-core' {
    interface Response {
        responseModule: ({ message, data, status }: IResponse) => void;
    }
}
