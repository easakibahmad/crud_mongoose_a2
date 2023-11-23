import { UserModel } from "../user.model";
import { User } from "./user.interface";
import { Request, Response } from "express";

const createUserIntoDB = async (user: User) => {
  // if (await UserModel.isUserExists(User.userId)) {
  //   throw new Error("User already exists");
  // }

  const result = await UserModel.create(user);
  return result;
};

const getAllUsersFromDB = async () => {
  const users = await UserModel.aggregate([
    {
      $project: {
        username: 1,
        fullName: {
          firstName: 1,
          lastName: 1,
        },
        age: 1,
        email: 1,
        address: {
          street: 1,
          city: 1,
          country: 1,
        },
        _id: 0,
      },
    },
  ]);
  return users;
};

const getSingleUserFromDB = async (userId: string) => {
  const user = await UserModel.findOne(
    { userId },
    {
      password: 0,
      orders: 0,
      __v: 0,
      _id: 0,
      "fullName._id": 0,
      "address._id": 0,
    }
  );
  return user;
};

const updateSingleUserFromDB = async (userId: string, updatedData: any) => {
  const updateData = { $set: updatedData };

  const result = await UserModel.updateOne({ userId }, updateData);
  return result;
};

const deleteSingleUserFromDB = async (userId: string) => {
  return await UserModel.deleteOne({ userId });
};

const addOrderInOrdersDB = async (userId: string, newOrder: any) => {
  const result = await UserModel.updateOne(
    { userId },
    {
      $push: {
        orders: newOrder,
      },
    }
  );
  return result;
};

export const userServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteSingleUserFromDB,
  updateSingleUserFromDB,
  addOrderInOrdersDB,
};
