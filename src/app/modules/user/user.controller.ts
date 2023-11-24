import { Request, Response } from "express";
import { userServices } from "./user.service";
import {
  UserValidationSchema,
  OrderValidatorSchema,
  UserUpdateValidationSchema,
} from "./user.zod.validation";

//api to create user
const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

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
    const zodParsedData = UserUpdateValidationSchema.parse(updatedData); //validate with partial fields for updating user data with zod

    const updatedDataKeys = Object.keys(updatedData); // check updated data keys
    const schemaKeys = Object.keys(UserUpdateValidationSchema.shape); //check schema keys
    const invalidKeys = updatedDataKeys.filter(
      (key) => !schemaKeys.includes(key)
    ); //get invalid keys
    const updatedUserId = updatedData?.userId;
    const result = await userServices.updateSingleUserFromDB(
      userId,
      zodParsedData
    );

    if (result) {
      // if invalid keys length is greater then 0
      if (invalidKeys.length > 0) {
        res.status(404).json({
          success: false,
          message: "Invalid keys found",
        });
        return;
      }
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
