export abstract class DomainError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
}

export class ValidationError extends DomainError {
  readonly code = "VALIDATION_ERROR";
  readonly statusCode = 400;
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends DomainError {
  readonly code = "NOT_FOUND";
  readonly statusCode = 404;
  constructor(entity: string, id?: string | number) {
    super(`${entity} ${id ? `with id ${id}` : ""} not found`);
  }
}

export class ConflictError extends DomainError {
  readonly code = "CONFLICT";
  readonly statusCode = 409;
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends DomainError {
  readonly code = "UNAUTHORIZED";
  readonly statusCode = 401;
  constructor(message = "Unauthorized") {
    super(message);
  }
}
