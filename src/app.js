import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use(errorHandler);

export default app;
