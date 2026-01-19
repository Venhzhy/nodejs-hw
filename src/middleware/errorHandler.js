import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = 'Server error';

  if (err instanceof HttpError) {
    statusCode = err.status;
    message = err.message;
  }

  res.status(statusCode).json({ message });
};

