import { Request, Response, NextFunction } from 'express'

/**
 * Express error handler middleware that returns a generic error response.
 * In development mode, includes the actual error message.
 * @param err - The error object thrown during request processing
 * @param _req - The Express request object (unused)
 * @param res - The Express response object
 * @param _next - The Express next function (unused)
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('Error:', err.message)

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  })
}
