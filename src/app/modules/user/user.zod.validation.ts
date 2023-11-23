import { z } from "zod";

const UserValidationSchema = z.object({
  userId: z.number(),
  username: z.string(),
  password: z.string(),
  fullName: z.object({
    firstName: z.string().max(20),
    lastName: z.string().max(20),
  }),
  age: z.number(),
  email: z
    .string()
    .email(),
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

export default UserValidationSchema;
