import { Request, Response } from "express";
import { userServices } from "./user.service";
import { UserModel } from "../user.model";
import {
  UserValidationSchema,
  OrderValidatorSchema,
} from "./user.zod.validation";

//api to create user
const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    // const existingUser = await UserModel.findOne({ userId: userData.userId });

    // if (existingUser) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "User with the same userId already exists",
    //   });
    // }

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
  } catch (error: any) {
    console.log(error);
    res.status(404).json({
      success: false,
      error: error.message || error,
    });
  }
};

// api to retrieve all users
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
    res.status(404).json({
      success: false,
      message: "Users fetched Error!",
    });
  }
};

// api to get single user by id
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
    } else {
      res.status(200).json({
        success: true,
        message: "User fetched successfully!",
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// api to update single user by its userId
const updateSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const updatedData = req.body;
    const updatedUserId = updatedData?.userId;
    // const existingUser = await UserModel.findOne({ userId });
    const result = await userServices.updateSingleUserFromDB(
      userId,
      updatedData
    );

    if (result) {
      // if userId is updated
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
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
        error: {
          code: 404,
          description: "User not found!",
        },
      });
    }
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
};

// api to deleting single user by its userId
const deleteSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    // const existingUser = await UserModel.findOne({ userId });

    if (await userServices.deleteSingleUserFromDB(userId)) {
      res.status(200).json({
        success: true,
        message: "User deleted successfully!",
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
        error: {
          code: 404,
          description: "User not found!",
        },
      });
    }
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
};

// api to update user orders data
const updateOrdersData = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const orderData = req.body;
    const validatedOrder = OrderValidatorSchema.parse(orderData);
    // const existingUser = await UserModel.findOne({ userId });

    if (await userServices.addOrderInOrdersDB(userId, validatedOrder)) {
      res.status(200).json({
        success: true,
        message: "Order created successfully!",
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
        error: {
          code: 404,
          description: "User not found!",
        },
      });
    }
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
};

// api to get specific user orders by its userId
const getSingleUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    // const existingUser = await UserModel.findOne({ userId });

    const result = await userServices.retrieveUserOrders(userId);

    if (result) {
      res.status(200).json({
        success: true,
        message: "Order fetched successfully!",
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
        error: {
          code: 404,
          description: "User not found!",
        },
      });
    }
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
};

// api to get totalPrice of orders
const getTotalPrice = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    // const existingUser = await UserModel.findOne({ userId });
    const result = await userServices.retrieveTotalPriceOfOrders(userId);
    if (result) {
      res.status(200).json({
        success: true,
        message: "Total price calculated successfully!",
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
        error: {
          code: 404,
          description: "User not found!",
        },
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
  updateOrdersData,
  getSingleUserOrders,
  getTotalPrice,
};
