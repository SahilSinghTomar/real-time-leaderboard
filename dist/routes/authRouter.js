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
const schemas_1 = require("../schemas");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const validatedFields = schemas_1.registerSchema.safeParse(body);
    if (!validatedFields.success) {
        return res.status(400).json({
            error: 'Invalid fields!',
        });
    }
    const { username, password } = validatedFields.data;
    try {
        const existingUser = yield db_1.default.user.findUnique({
            where: {
                username,
            },
        });
        if (existingUser) {
            return res.status(400).json({
                error: 'Username already exists!',
            });
        }
        const hashedPassword = yield (0, bcryptjs_1.hash)(password, 12);
        yield db_1.default.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });
        return res.status(201).json({
            message: 'User created Successfully!',
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const validatedFields = schemas_1.loginSchema.safeParse(body);
    if (!validatedFields.success) {
        return res.status(400).json({
            error: 'Invalid fields!',
        });
    }
    const { username, password } = validatedFields.data;
    try {
        const user = yield db_1.default.user.findUnique({
            where: {
                username,
            },
        });
        if (!user) {
            return res.status(404).json({
                error: 'User not found!',
            });
        }
        const isPasswordValid = yield (0, bcryptjs_1.compare)(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                error: 'Invalid credientials!',
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, 'PRANJUL', {
            expiresIn: '1h',
        });
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
        });
        return res.status(200).json({
            message: 'Login successful!',
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
}));
exports.default = router;
