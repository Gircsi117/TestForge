import { FastifyReply, FastifyRequest } from "fastify";

export enum ErrorName {
  Unauthorized = "Unauthorized",
  NotFound = "NotFound",
  MissingArgument = "MissingArgument",
  AlreadyExists = "AlreadyExists",
  InternalServerError = "InternalServerError",
  Error = "Error",
}

export enum HTTPStatus {
  Unauthorized = 401,
  NotFound = 404,
  MissingArgument = 400,
  AlreadyExists = 409,
  InternalServerError = 500,
}

export const getStatusCode = (error: Error) => {
  switch (error.name as ErrorName) {
    case ErrorName.Unauthorized:
      return HTTPStatus.Unauthorized;
    case ErrorName.NotFound:
      return HTTPStatus.NotFound;
    case ErrorName.MissingArgument:
      return HTTPStatus.MissingArgument;
    case ErrorName.AlreadyExists:
      return HTTPStatus.AlreadyExists;
    default:
      return HTTPStatus.InternalServerError;
  }
};

export class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message?: string) {
    super(message ?? "Unauthorized!");
    this.name = ErrorName.Unauthorized;
    this.statusCode = HTTPStatus.Unauthorized;
  }
}

export class NotFoundError extends Error {
  public statusCode: number;

  constructor(message?: string) {
    super(message ?? "Not found!");
    this.name = ErrorName.NotFound;
    this.statusCode = HTTPStatus.NotFound;
  }
}

export class MissingArgumentError extends Error {
  public statusCode: number;

  constructor(message?: string) {
    super(message ?? "Missing argument!");
    this.name = ErrorName.MissingArgument;
    this.statusCode = HTTPStatus.MissingArgument;
  }
}

export class AlreadyExistsError extends Error {
  public statusCode: number;

  constructor(message?: string) {
    super(message ?? "Resource already exists!");
    this.name = ErrorName.AlreadyExists;
    this.statusCode = HTTPStatus.AlreadyExists;
  }
}
