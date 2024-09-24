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
const redis_1 = __importDefault(require("../utils/redis"));
const db_1 = __importDefault(require("../utils/db"));
const router = express_1.default.Router();
// Helper function to format leaderboard data
const formatLeaderboard = (topUsers) => {
    const leaderboard = [];
    for (let i = 0; i < topUsers.length; i += 2) {
        const [username, timestamp] = topUsers[i].split(':');
        leaderboard.push({
            username,
            timestamp: new Date(Number(timestamp)).toISOString(),
            score: Number(topUsers[i + 1]),
        });
    }
    return leaderboard;
};
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    try {
        // Fetch top players without date filtering
        const topUsers = yield redis_1.default.zrevrange(`game:${id}:leaderboard`, start, end, 'WITHSCORES');
        const totalMembers = yield redis_1.default.zcard(`game:${id}:leaderboard`);
        const totalPages = Math.ceil(totalMembers / limit);
        return res.status(200).json({
            success: 'Leaderboard fetched successfully',
            data: {
                currentPage: page,
                totalPages,
                totalItems: totalMembers,
                leaderboard: formatLeaderboard(topUsers),
            },
        });
    }
    catch (err) {
        console.error('Error fetching leaderboard:', err);
        return res.status(500).json({
            error: 'Internal Server Error. Could not fetch leaderboard.',
        });
    }
}));
router.get('/:id/rank', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userId;
    try {
        const user = yield db_1.default.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const redisKey = `game:${id}:leaderboard`;
        const rank = yield redis_1.default.zrevrank(redisKey, user.username);
        if (!rank) {
            return res.status(404).json({ error: 'User not found in leaderboard' });
        }
        const userScore = yield redis_1.default.zscore(redisKey, user.username);
        return res.status(200).json({
            success: 'User rank fetched successfully',
            data: {
                username: user.username,
                rank: rank + 1,
                score: userScore,
            },
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}));
exports.default = router;
