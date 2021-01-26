const express = require("express");
const {getAllTours, createTour, getTour, updateTour, deleteTour, checkID, checkBody,aliasTopTours, getTourStats, getMonthlyPlan} = require("../controllers/tourController") 

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
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour)

module.exports = tourRouter;