import express, { Request, Response } from "express";
import { search } from "../controllers/search";

const searchRouter = express.Router();

searchRouter.get("/", async (req: Request, res: Response) => {
  const { userId } = req.body.token;
  const { query } = req.query;

  const response = await search(query as string, userId);

  res.status(response.statusCode).json(response);
});

export default searchRouter;
