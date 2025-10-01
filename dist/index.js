"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const dB_connect_1 = require("./dB/dB.connect");
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config({ path: "../.env" });
const PORT = process.env.PORT ? Number(process.env.PORT) : 1000;
(0, dB_connect_1.connectDB)()
    .then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`The server is running at port: ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Error connecting to the database:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map