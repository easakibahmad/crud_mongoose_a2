import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;

    const result = await userServices.createUserIntoDB(user);

    res.status(200).json({
      success: true,
      messages: "User created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const userController = {
  createUser,
};
