"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const leaderboardRouter_1 = __importDefault(require("./routes/leaderboardRouter"));
const gameRouter_1 = __importDefault(require("./routes/gameRouter"));
const authMiddleware_1 = __importDefault(require("./routes/authMiddleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.get('/', (_, res) => {
    res.send('Real-time Leaderboard!');
});
app.use('/api/v1/auth', authRouter_1.default);
app.use('/api/v1/games', authMiddleware_1.default, gameRouter_1.default);
app.use('/api/v1/leaderboard', authMiddleware_1.default, leaderboardRouter_1.default);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
