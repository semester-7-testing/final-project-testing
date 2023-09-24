import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import limiter from "./middleware/rate-limiter.js";
import socketServer from "./socketServer.js";
//routes
import authRouter from "./routes/authRouter.js";
import orderRouter from "./routes/orderRouter.js";
import productsRouter from "./routes/productsRouter.js";
import chatRoomRouter from "./routes/chatRoomRouter.js";
import checkoutRouter from "./routes/checkoutRouter.js";
import assetsRouter from "./routes/assetsRouter.js";

dotenv.config();

mongoose
  .set("strictQuery", true) // remove a mongoose warning
  .connect(process.env.MONGO_URI)
  .then((mongoose) => {
    console.log("Connected to DB");
    const app = express();
    //set up express app
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(limiter);
    //routers
    app.use("/api/auth", authRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/order", orderRouter);
    app.use("/api/chatrooms", chatRoomRouter);
    app.use("/api/checkout", checkoutRouter);
    app.use("/api/assets", assetsRouter);
    app.use("/test", (req, res) => {
      res.send("Backend is working and is ready for requests");
    });
    //spin up the server
    const PORT = process.env.SERVER_PORT || 8080;
    const SOCKET_PORT = process.env.SOCKET_PORT || 8081;
    socketServer(SOCKET_PORT, mongoose);
    app.listen(PORT, () => {
      console.log("Server is runnig on port: ", PORT);
      console.log("Socket server is running on port: ", SOCKET_PORT);
    });
  })
  .catch((error) => {
    console.log({ error });
    throw new Error(error);
  });
