import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from './routes/user.routes.js';
import session from "express-session";
import placementRouter from './routes/placement.routes.js';

dotenv.config({
  path: "../.env",
});

const app = express();



app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));



app.use("/api/v1/users", userRouter);
app.use("/api/v1/placement", placementRouter);


app.get('/', (req, res) => {
    res.send("Server is live");
  });

export { app };
// // const app = express.Router();
// export default app;
