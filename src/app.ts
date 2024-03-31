import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import config from '@src/config/config';
import { ApiError, InternalError, NotFoundError } from '@src/utils/apiError';
import logger from '@src/utils/logger';
import router from '@src/routes/v1/routes';

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors({ origin: true, optionsSuccessStatus: 200 }));

// v1 api routes
app.use('/v1', router);

// send back a 404 error for any unknown api request
app.use((req: Request, _res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Not Found - ${req.originalUrl}`);
  next(error);
});

// global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (config.env === 'development') {
      logger.info(err);
    }
    ApiError.handle(new InternalError('An error occurred'), res);
  }
});

export default app;
