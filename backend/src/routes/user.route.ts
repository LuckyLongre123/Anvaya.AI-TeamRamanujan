import { Router } from "express";
import {
	createUser,
	loginUser,
	getAllUsers,
	deleteUser,
	deleteAllUsers,
} from "../controllers/user.controller";

const userRouter = Router();

// Create a new user
userRouter.post("/users", createUser);

// Login
userRouter.post("/users/login", loginUser);

// Get all users
userRouter.get("/users", getAllUsers);

// Delete a specific user
userRouter.delete("/users/:id", deleteUser);

// Delete all users
userRouter.delete("/users", deleteAllUsers);



export default userRouter;

/*

all methods of user

post /users - create user
post /users/login - login user
get /users - get all users
delete /users/:id - delete a specific user
delete /users - delete all users


 */