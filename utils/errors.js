/* eslint-disable max-classes-per-file */
class RequestError extends Error {
  constructor() {
    super();
    this.message = "잘못된 요청입니다.";
    this.status = 400;
  }
}

function createRequestError(message = "잘못된 요청입니다.") {
  const error = new Error(message);

  error.status = 400;

  return error;
}

class LoginError extends Error {
  constructor() {
    super();
    this.message = "로그인에 실패했습니다. 다시 시도해 주세요.";
    this.status = 401;
  }
}

function createLoginError(message = "로그인에 실패했습니다.") {
  const error = new Error(message);

  error.status = 401;

  return error;
}

class AuthenticationError extends Error {
  constructor() {
    super();
    this.message = "사용자 인증에 실패했습니다.";
    this.status = 401;
  }
}

function createAuthenticationError(message = "사용자 인증에 실패했습니다.") {
  const error = new Error(message);

  error.status = 401;

  return error;
}

class NotFoundError extends Error {
  constructor() {
    super();
    this.message = "해당 페이지를 찾을 수 없습니다.";
    this.status = 404;
  }
}

function createNotFoundError(message = "해당 페이지를 찾을 수 없습니다.") {
  const error = new Error(message);

  error.status = 404;

  return error;
}

module.exports = {
  LoginError,
  AuthenticationError,
  NotFoundError,
  RequestError,
  createRequestError,
  createLoginError,
  createAuthenticationError,
  createNotFoundError,
};
