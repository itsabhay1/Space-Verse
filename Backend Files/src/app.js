import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { User } from "./models/user.model.js";
// import { googleAuth, googleAuthCallback } from './controllers/user.controller.js';
import userRouter from './routes/user.routes.js';
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
import session from "express-session";

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


app.get('/', (req, res) => {
    res.send("Server is live");
  });

export { app };