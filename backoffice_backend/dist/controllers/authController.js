"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../models/userModel");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // Certifique-se de definir isso no arquivo .env
// Registrar um novo usuário
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
    res.status(201).json({ message: 'Usuário registrado com sucesso', user });
};
exports.registerUser = registerUser;
// Login de usuário
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    // Buscar o usuário pelo nome
    const user = await (0, userModel_1.findUserByUsername)(username);
    if (!user) {
        return res.status(400).json({ error: 'Usuário não encontrado.' });
    }
    // Verificar a senha
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha incorreta.' });
    }
    // Gerar token JWT
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '1h',
    });
    res.status(200).json({ message: 'Login bem-sucedido', token });
};
exports.loginUser = loginUser;
