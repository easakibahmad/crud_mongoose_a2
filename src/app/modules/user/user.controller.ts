import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;

    const result = await userServices.createUserIntoDB(userData);

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
      message: "Internal Server Error",
    });
  }
};

export const userController = {
  createUser,
};
