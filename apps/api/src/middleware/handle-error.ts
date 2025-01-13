import type { AppBindings } from '@/lib/types';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { StatusCode } from 'hono/utils/http-status';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';

interface ErrorWithStatus {
  status: StatusCode;
  message: string;
  stack?: string;
}

type PrismaError =
  | PrismaClientKnownRequestError
  | PrismaClientUnknownRequestError
  | PrismaClientRustPanicError
  | PrismaClientInitializationError
  | PrismaClientValidationError;

/**
 * Extracts Prisma-specific error details based on error type.
 *
 * @param error - The Prisma error to extract details from
 * @returns Object containing error-specific details
 */
function getPrismaErrorDetails(error: PrismaError): Record<string, unknown> {
  const details: Record<string, unknown> = {
    name: error.name,
    message: error.message,
    clientVersion: error.clientVersion,
  };

  if (error instanceof PrismaClientKnownRequestError) {
    details.code = error.code;
    details.meta = error.meta;
  } else if (error instanceof PrismaClientInitializationError) {
    details.errorCode = error.errorCode;
  }

  return details;
}

/**
 * Gets full error details including cause chain.
 */
function getFullErrorDetails(error: Error): Record<string, unknown> {
  const details: Record<string, unknown> = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };

  if (error.cause && error.cause instanceof Error) {
    details.cause = getFullErrorDetails(error.cause);
  }

  if (isPrismaError(error)) {
    Object.assign(details, getPrismaErrorDetails(error));
  }

  return details;
}

/**
 * Checks if the provided error is a Prisma error.
 */
const isPrismaError = (error: unknown): error is PrismaError => {
  return (
    error instanceof PrismaClientKnownRequestError ||
    error instanceof PrismaClientUnknownRequestError ||
    error instanceof PrismaClientRustPanicError ||
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientValidationError
  );
};

/**
 * Handles Prisma errors and maps them to HTTP status codes.
 *
 * @remarks
 * Maps common Prisma errors to HTTP status codes:
 * - 404: Record not found (P2001, P2025)
 * - 409: Unique constraint violation (P2002)
 * - 503: Connection/availability issues (P2024, P2028)
 * - 400: Validation errors
 * - 500: Other errors
 *
 * @see {@link https://www.prisma.io/docs/orm/reference/error-reference}
 */
const handlePrismaError = (error: PrismaError): ErrorWithStatus => {
  if (error instanceof PrismaClientValidationError) {
    return {
      status: HttpStatusCodes.BAD_REQUEST,
      message: error.message,
      stack: error.stack,
    };
  }

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2025':
      case 'P2001':
        return {
          status: HttpStatusCodes.NOT_FOUND,
          message: HttpStatusPhrases.NOT_FOUND,
          stack: error.stack,
        };
      case 'P2002':
        return {
          status: HttpStatusCodes.CONFLICT,
          message: HttpStatusPhrases.CONFLICT,
          stack: error.stack,
        };
      case 'P2024':
      case 'P2028':
        return {
          status: HttpStatusCodes.SERVICE_UNAVAILABLE,
          message: HttpStatusPhrases.SERVICE_UNAVAILABLE,
          stack: error.stack,
        };
      default:
        return {
          status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
          message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
          stack: error.stack,
        };
    }
  }

  if (error instanceof PrismaClientInitializationError) {
    return {
      status: HttpStatusCodes.SERVICE_UNAVAILABLE,
      message: HttpStatusPhrases.SERVICE_UNAVAILABLE,
      stack: error.stack,
    };
  }

  return {
    status: HttpStatusCodes.INTERNAL_SERVER_ERROR,
    message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
    stack: error.stack,
  };
};

/**
 * Creates a structured log object for consistent error logging.
 */
function createStructuredLog(
  error: Error,
  context: {
    requestId: string;
    path: string;
    method: string;
    status: number;
    environment: string;
  },
): Record<string, unknown> {
  return {
    timestamp: new Date().toISOString(),
    requestId: context.requestId,
    path: context.path,
    method: context.method,
    status: context.status,
    environment: context.environment,
    error: getFullErrorDetails(error),
  };
}

/**
 * Global error handler middleware for Hono applications.
 */
export const handleError: ErrorHandler<AppBindings> = (err, c) => {
  let errorResponse: ErrorWithStatus;
  const requestId = c.get('requestId');
  const environment = c.env.NODE_ENV;
  const isProduction = environment === 'production';

  if (err instanceof HTTPException && err.status === 422 && err.cause) {
    return c.json(
      {
        ...err.cause,
        requestId,
        ...(isProduction ? {} : { stack: err.stack }),
      },
      422 as ContentfulStatusCode,
    );
  }

  if (isPrismaError(err)) {
    errorResponse = handlePrismaError(err);
  } else {
    const currentStatus = 'status' in err ? err.status : c.newResponse(null).status;
    const statusCode =
      currentStatus !== HttpStatusCodes.OK
        ? (currentStatus as StatusCode)
        : HttpStatusCodes.INTERNAL_SERVER_ERROR;

    errorResponse = {
      status: statusCode,
      message:
        statusCode === HttpStatusCodes.INTERNAL_SERVER_ERROR
          ? HttpStatusPhrases.INTERNAL_SERVER_ERROR
          : err.message,
      stack: err.stack,
    };
  }

  if (errorResponse.status >= 500) {
    const logContext = {
      requestId,
      path: c.req.path,
      method: c.req.method,
      status: errorResponse.status,
      environment,
    };

    const logData = createStructuredLog(err, logContext);
    console.error(JSON.stringify(logData, null, 2));
  }

  return c.json(
    {
      message: errorResponse.message,
      ...(isProduction ? {} : { stack: errorResponse.stack }),
      requestId,
    },
    errorResponse.status as ContentfulStatusCode,
  );
};
