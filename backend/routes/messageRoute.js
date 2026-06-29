import express from "express";
import { createMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.post("/", createMessage);

export default messageRouter;
