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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../utils/db"));
const protectedRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies.token) {
        return res.status(401).json({
            error: 'Unauthorized',
        });
    }
    const token = req.cookies.token;
    try {
        const decoded = jsonwebtoken_1.default.verify(token, 'PRANJUL');
        const user = yield db_1.default.user.findUnique({
            where: {
                id: decoded.id,
            },
        });
        if (!user) {
            return res.status(401).json({
                error: 'Unauthorized',
            });
        }
        req.user = user;
    }
    catch (err) {
        return res.status(401).json({
            error: 'Unauthorized',
        });
    }
    next();
});
exports.default = protectedRoute;
