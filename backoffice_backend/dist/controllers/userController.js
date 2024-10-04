"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUsers = exports.registerUser = void 0;
const userModel_1 = require("../models/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Criar um novo usuário
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;
    // Verificar se o usuário já existe
    const existingUser = await (0, userModel_1.findUserByUsername)(username);
    if (existingUser) {
        return res.status(400).json({ error: 'Usuário já existe.' });
    }
    // Criptografar a senha
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // Criar o usuário
    const user = await (0, userModel_1.createUser)({
        username,
        password: hashedPassword,
        role,
    });
    res.status(201).json(user);
};
exports.registerUser = registerUser;
const findUsers = async (req, res) => {
    const { username, password, role } = req.body;
    // Verificar se o usuário já existe
    const existingUser = await (0, userModel_1.findUsers)();
    res.status(201).json(existingUser);
};
exports.findUsers = findUsers;
