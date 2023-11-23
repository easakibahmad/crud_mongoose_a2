import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/users", userController.createUser);
router.get("/users", userController.getAllUsers);
router.get("/users/:userId", userController.getSingleUser);
router.delete("/users/:userId", userController.deleteSingleUser);
router.put("/users/:userId", userController.updateSingleUser);
router.put("/users/:userId/orders", userController.updateOrdersData);

export const userRoutes = router;
