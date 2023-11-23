import express, { Application, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./app/modules/user/user.route";
const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);

const getAController = (req: Request, res: Response) => {
  res.send("Welcome to the api users!");
};

app.get("/", getAController);

export default app;
