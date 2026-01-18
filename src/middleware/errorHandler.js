import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, _next) => {
  let statusCode = 500;
  let message = 'Server error';

  if (createHttpError.isHttpError(err)) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({ message });
};
