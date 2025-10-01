import mongoose, { Document, Model, Schema } from "mongoose";
import jwt, { Secret, SignOptions } from "jsonwebtoken";


import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  refreshToken?: string;

  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      required: true,
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
   
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
    throw new Error("Access token env variables not set");
  }

const accessTokenSecret: Secret = process.env.ACCESS_TOKEN_SECRET!;
const accessTokenExpiry: SignOptions = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRY)
 };

return jwt.sign(
  {
    _id: this._id.toString(),
    email: this.email,
    fullName: this.fullName,
  },
  accessTokenSecret,
  accessTokenExpiry
);
};

userSchema.methods.generateRefreshToken = function (): string {
  if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRY) {
    throw new Error("Refresh token env variables not set");
  }

  const refreshTokenSecret: Secret = process.env.REFRESH_TOKEN_SECRET!;
  const refreshTokenExpiry: SignOptions = { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRY)  };

  return jwt.sign(
    { _id: this._id.toString() },
    refreshTokenSecret,
    refreshTokenExpiry
  );
};
export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
