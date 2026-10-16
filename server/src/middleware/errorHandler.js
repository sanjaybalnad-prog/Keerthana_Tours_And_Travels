import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const notFound = (req, res, next) => {
  next(new ApiError(404, 'Route not found'));
};

// Centralized error handler. Only messages we deliberately wrote are sent to the client;
// everything else becomes a generic 500 and is logged on the server.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = 500;
  let message = 'Something went wrong. Please try again later.';

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Request body contains invalid JSON';
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID or value supplied';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with this value already exists';
  }

  if (statusCode >= 500) {
    // Stack traces stay in the server logs only.
    console.error(err);
  } else if (!env.isProduction && !(err instanceof ApiError)) {
    console.warn(`${statusCode}: ${err.name}: ${err.message}`);
  }

  res.status(statusCode).json({ success: false, message });
};
