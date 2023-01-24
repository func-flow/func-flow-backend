/* eslint-disable max-classes-per-file */
import { Response } from "express";

export interface ErrorWithHttpCode {
  message: string;
  code: number;
}

export class UserError extends Error implements ErrorWithHttpCode {
  message: string;
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.message = message;
    this.code = code;
  }
}

class SystemError extends Error {
  code: number;

  constructor() {
    super("unable to process request at this time");
    this.code = 500;
  }
}

export class NotFoundError extends UserError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class UserNotAuthorized extends UserError {
  constructor() {
    super(`user not authorized`, 403);
  }
}

export class UserRoleNotMatched extends UserError {
  constructor() {
    super(`user not authorized to access this application`, 403);
  }
}

export class ActionNotAllow extends UserError {
  constructor() {
    super(
      `you are not allowed to perform this action. Please ensure you have the correct rights`,
      403
    );
  }
}

export class ResourceRequired extends UserError {
  constructor(resource: string) {
    super(`${resource} is required`, 400);
  }
}

export function handleError(error: unknown): Error {
  console.debug(error);

  // HANDLE SENTRY REPORTING

  if (error instanceof UserError) return error;
  return new SystemError();
}

export function sendErrorResponse(res: Response, error: UserError): void {
  console.error(error);
  res.status(error.code || 500).json({ success: false, error: error.message });
}

export class RedisConnectError extends Error {
  code: number;

  constructor() {
    super("Redis connection failed");
    this.code = 500;
  }
}
