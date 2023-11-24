import { z } from "zod";

export const UserValidationSchema = z.object({
  userId: z.number(),
  username: z.string(),
  password: z.string(),
  fullName: z.object({
    firstName: z.string().max(20),
    lastName: z.string().max(20),
  }),
  age: z.number(),
  email: z.string().email(),
  isActive: z.boolean(),
  hobbies: z.array(z.string()),
  address: z.object({
    street: z.string(),
    city: z.string(),
    country: z.string(),
  }),
  orders: z
    .array(
      z.object({
        productName: z.string(),
        price: z.number(),
        quantity: z.number(),
      })
    )
    .default([]),
});

export const OrderValidatorSchema = z.object({
  productName: z.string(),
  price: z.number(),
  quantity: z.number(),
});

export const UserUpdateValidationSchema = z
  .object({
    userId: z.number().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    fullName: z
      .object({
        firstName: z.string().max(20).optional(),
        lastName: z.string().max(20).optional(),
      })
      .optional(),
    age: z.number().optional(),
    email: z.string().email().optional(),
    isActive: z.boolean().optional(),
    hobbies: z.array(z.string()).optional(),
    address: z
      .object({
        street: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
      })
      .optional(),
  })
  .partial();
