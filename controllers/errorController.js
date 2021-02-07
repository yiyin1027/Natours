const AppError = require("./../utils/appError");

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  // return new AppError(message, 400);
}

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg;
  const message = `Duplicate field value: x. Please use another value`
}

const handleJWTError = err => new AppError('Invalid token. Please log in again', 401);

const handleJWTExpiredError = err => {
  new AppError('Your token has expired! Please log in again', 401)
}

const sendErrorDev = (err, res) => {
  console.log()
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    aa: "test" + err.isOperational,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  console.log("This is production");
  // if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  // } else {
  //   console.log('error', err);
  //   res.status(500).json({
  //     status: 'error',
  //     message: 'Something went very wrong!'
  //   });
  // }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  console.log(err.message, "err");

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    console.log("err:", err.isOperational)
    let error = {...err};

    if(error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if(error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);   
    // console.log(error.message,"error")

    // if(error.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(err, res);
  }
}