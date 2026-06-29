import express from "express";
import { createMessage } from "../controllers/messages.js";

const messageRouter = express.Router();

messageRouter.post("/messages", createMessage);

export default messageRouter;
