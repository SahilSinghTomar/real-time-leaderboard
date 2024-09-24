"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../utils/db"));
const redis_1 = __importDefault(require("../utils/redis"));
const router = express_1.default.Router();
router.get('/bulk', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const games = yield db_1.default.game.findMany();
        return res.status(200).json({
            success: 'All games fetched successfully',
            data: games,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
router.post('/score/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { score } = req.body;
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.userId;
    const user = yield db_1.default.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    try {
        const game = yield db_1.default.game.findUnique({
            where: {
                id,
            },
        });
        if (!game) {
            res.status(404).json({ error: 'Game not found' });
        }
        yield db_1.default.score.create({
            data: {
                score,
                userId,
                gameId: id,
            },
        });
        const timestamp = Date.now();
        yield redis_1.default.zadd(`game:${id}:leaderboard`, score, `${user.username}:${timestamp}`);
        yield redis_1.default.zadd(`overall:leaderboard`, score, user.username);
        res.status(201).json({
            success: 'Score added successfully',
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
