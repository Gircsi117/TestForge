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

export const errorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  reply.code(getStatusCode(error));
  reply.send({
    statusCode: reply.statusCode,
    message: error.message,
    error: error.name,
  });
};

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? "Unauthorized!");
    this.name = ErrorName.Unauthorized;
  }
}

export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? "Not found!");
    this.name = ErrorName.NotFound;
  }
}

export class MissingArgumentError extends Error {
  constructor(message?: string) {
    super(message ?? "Missing argument!");
    this.name = ErrorName.MissingArgument;
  }
}

export class AlreadyExistsError extends Error {
  constructor(message?: string) {
    super(message ?? "Resource already exists!");
    this.name = ErrorName.AlreadyExists;
  }
}