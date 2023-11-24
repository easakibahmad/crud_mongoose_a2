import { UserModel } from "../user.model";
import { User } from "./user.interface";
import { Request, Response } from "express";

const createUserIntoDB = async (user: User) => {
  // use user static method to check user exists or not
  if (await UserModel.isUserExists(user.userId)) {
    throw new Error("User already exists");
  }

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
  // use user static method to check user exists or not
  if (await UserModel.isUserExists(parseInt(userId, 10))) {
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
  }

  
};

const updateSingleUserFromDB = async ( userId: string, updatedData: any ) =>
{
  if (await UserModel.isUserExists(parseInt(userId, 10)))  {
    const updateData = { $set: updatedData };

    const result = await UserModel.updateOne({ userId }, updateData);
    return result;
  }
  
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

const retrieveUserOrders = async (userId: string) => {
  const orders = await UserModel.findOne(
    { userId },
    {
      orders: {
        $map: {
          input: "$orders",
          as: "order",
          in: {
            productName: "$$order.productName",
            price: "$$order.price",
            quantity: "$$order.quantity",
            _id: 0,
          },
        },
      },
      _id: 0,
    }
  );
  return orders;
};

const retrieveTotalPriceOfOrders = async (userId: string) => {
  const totalPrice = await UserModel.findOne(
    { userId },
    {
      totalPrice: {
        $sum: {
          $map: {
            input: "$orders",
            as: "order",
            in: {
              $multiply: ["$$order.price", "$$order.quantity"],
            },
          },
        },
      },
      _id: 0,
    }
  );
  return totalPrice;
};

export const userServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteSingleUserFromDB,
  updateSingleUserFromDB,
  addOrderInOrdersDB,
  retrieveUserOrders,
  retrieveTotalPriceOfOrders,
};
