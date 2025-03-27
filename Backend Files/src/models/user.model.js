import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import "dotenv/config"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        role: {
            type: String,
            enum: ["admin", "astronaut"],
            default: "astronaut",
        },
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema)