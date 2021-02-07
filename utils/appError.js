class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = 1;
    console.log(message,"kpp");

    Error.captureStackTrace(this, this.constructor);
    console.log(this.isOperational);
  }
}

module.exports = AppError;  