import express from "express";
import authRouter from "./authRouter";

const masterRouter = express.Router();

masterRouter.use("/auth", authRouter);

export default masterRouter;
