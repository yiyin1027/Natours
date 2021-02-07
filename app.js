const express = require('express');
const bodyParser = require('body-parser');
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");
const globalErrorHandler = require("./controllers/errorController");
 
// const AppError = require("./utils/appError");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

//MIDDLEWARE

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

if(process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//CONTROLLER
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);


app.all('*', (req, res, next) => {

  next(new AppError(`Can't find ${req.originalUrl} on the server!`));

});

app.use(globalErrorHandler);

module.exports = app;
