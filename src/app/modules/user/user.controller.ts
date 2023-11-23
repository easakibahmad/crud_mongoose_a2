import { Request, Response } from "express";
import { userServices } from "./user.service";
import { UserModel } from "../user.model";
import UserValidationSchema from "./user.zod.validation";

const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    const existingUser = await UserModel.findOne({ userId: userData.userId });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with the same userId already exists",
      });
    }

    const zodParsedData = UserValidationSchema.parse(userData);

    const result = await userServices.createUserIntoDB(zodParsedData);

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
  try {
    const userId = req.params.userId;
    const updatedData = req.body;
    const existingUser = await UserModel.findOne({ userId });
    const result = await userServices.updateSingleUserFromDB(
      userId,
      updatedData
    );

    if (existingUser) {
      if (result) {
        // if userId is updated
        const updatedUserId = updatedData?.userId;

        if (updatedUserId) {
          const updatedUserNewData = await userServices.getSingleUserFromDB(
            updatedUserId
          );
          res.status(200).json({
            success: true,
            message: "User updated successfully!",
            data: updatedUserNewData,
          });
        }
        // if userId is not updated
        else {
          const updatedUserNewData = await userServices.getSingleUserFromDB(
            userId
          );
          res.status(200).json({
            success: true,
            message: "User updated successfully!",
            data: updatedUserNewData,
          });
        }
      }
    } else {
      res.status(404).json({
        success: false,
        message: "User not found (user is not existing!)",
      });
    }
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
};
const deleteSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const existingUser = await UserModel.findOne({ userId });

    if (existingUser) {
      if (await userServices.deleteSingleUserFromDB(userId)) {
        res.status(200).json({
          success: true,
          message: "User deleted successfully!",
          data: null,
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "User not found, (already deleted or user is not existing!)",
      });
    }
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  updateSingleUser,
};
