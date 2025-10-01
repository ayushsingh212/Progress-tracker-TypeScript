"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
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
    refreshToken: {
        type: String,
    },
}, {
    timestamps: true,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt_1.default.hash(this.password, 12);
    next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt_1.default.compare(password, this.password);
};
userSchema.methods.generateAccessToken = function () {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRY) {
        throw new Error("Access token env variables not set");
    }
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenExpiry = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRY)
    };
    return jsonwebtoken_1.default.sign({
        _id: this._id.toString(),
        email: this.email,
        fullName: this.fullName,
    }, accessTokenSecret, accessTokenExpiry);
};
userSchema.methods.generateRefreshToken = function () {
    if (!process.env.REFRESH_TOKEN_SECRET || !process.env.REFRESH_TOKEN_EXPIRY) {
        throw new Error("Refresh token env variables not set");
    }
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const refreshTokenExpiry = { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRY) };
    return jsonwebtoken_1.default.sign({ _id: this._id.toString() }, refreshTokenSecret, refreshTokenExpiry);
};
exports.User = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user.model.js.map