import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["admin", "employee"],
            default: "employee"
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    });
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});
// password check method
userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password);

};

// Access token generation method
userSchema.methods.generateAccessToken = function () {

    return jwt.sign(

        {
            _id: this._id,
            email: this.email,
            role: this.role
        },

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    );

};

// Refresh toke generation method

userSchema.methods.generateRefreshToken = function () {

    return jwt.sign(

        {
            _id: this._id
        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    );

};


export const User = mongoose.model("User", userSchema);