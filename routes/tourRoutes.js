const express = require("express");
const {getAllTours, createTour, getTour, updateTour, deleteTour, checkID, checkBody,aliasTopTours, getTourStats, getMonthlyPlan} = require("../controllers/tourController") 
const authController = require("../controllers/authController");

const tourRouter = express.Router();

// tourRouter.param("id", checkID);
tourRouter
  .route("/tour-stats")
  .get(getTourStats)

tourRouter
  .route("/monthly-plan/:year")
  .get(getMonthlyPlan)

tourRouter
  .route("/top-5-cheap")
  .get(aliasTopTours, getAllTours);

tourRouter
  .route("/")
  .get(authController.protect, getAllTours)
  .post(createTour);

tourRouter
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(authController.protect, authController.restrictTo('admin', 'lead-guide'),deleteTour)

module.exports = tourRouter;