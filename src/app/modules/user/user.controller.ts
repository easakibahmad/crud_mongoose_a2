import { Request, Response } from "express";
import { userServices } from "./user.service";
import { UserModel } from "../user.model";
import UserValidationSchema from "./user.zod.validation";

const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    const zodParsedData = UserValidationSchema.parse(userData);

    const result = await userServices.createUserIntoDB(zodParsedData);

    const existingUser = await UserModel.findOne({ userId: result.userId });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with the same userId already exists",
      });
    } else {
      const resultWithoutExcludedFields = {
        userId: result.userId,
        username: result.username,
        fullName: {
          firstName: result.fullName.firstName,
          lastName: result.fullName.lastName,
        },
        age: result.age,
        email: result.email,
        isActive: result.isActive,
        hobbies: result.hobbies,
        address: {
          street: result.address.street,
          city: result.address.city,
          country: result.address.country,
        },
      };

      res.status(200).json({
        success: true,
        messages: "User created successfully",
        data: resultWithoutExcludedFields,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userServices.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully!",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await userServices.getSingleUserFromDB(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
        error: {
          code: 404,
          description: "User not found!",
        },
      });
    }
    console.log(user);
    res.status(200).json({
      success: true,
      message: "User fetched successfully!",
      data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const updateSingleUser = async (req: Request, res: Response) => {
  const userId = req.params.userId;
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
};
