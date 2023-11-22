import express from "express";
import { userController } from "./user.controller";

const router = express.Router();

router.post("/api/users", userController.createUser);
