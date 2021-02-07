const express = require("express");
const {getAllUsers, createUser, getUser, updateUser, deleteUser} = require("./../controllers/userController");
const authController = require('./../controllers/authController');

const userRouter = express.Router();

userRouter.post("/signup", authController.signup);
userRouter.post("/login", authController.login);

userRouter.param("id", (req, res, next, val) =>{
  console.log(`This is ${id} tour`);
  next();
})

userRouter
  .route("/")
  .get(getAllUsers)
  .post(createUser)

userRouter
  .route("/:id")
  .get(getUser) 
  .patch(updateUser)
  .delete(deleteUser)

module.exports = userRouter;