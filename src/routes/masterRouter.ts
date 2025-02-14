import express from "express";
import authRouter from "./authRouter";
import postRouter from "./postRouter";
import authCheck from "../middlewares/authCheck";

const masterRouter = express.Router();

masterRouter.use("/auth", authRouter);
masterRouter.use("/post", authCheck, postRouter);

export default masterRouter;
