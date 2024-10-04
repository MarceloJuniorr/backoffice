"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUsers = exports.findUserByUsername = exports.createUser = void 0;
const prismaClient_1 = __importDefault(require("./prismaClient"));
// Criar um novo usuário
const createUser = async (userData) => {
    const user = await prismaClient_1.default.user.create({
        data: {
            username: userData.username,
            password: userData.password, // Lembre-se de criptografar a senha
            role: userData.role || 'USER',
        },
    });
    return user;
};
exports.createUser = createUser;
// Buscar usuário por nome
const findUserByUsername = async (username) => {
    const user = await prismaClient_1.default.user.findUnique({
        where: { username },
    });
    return user;
};
exports.findUserByUsername = findUserByUsername;
const findUsers = async () => {
    const user = await prismaClient_1.default.user.findMany();
    return user;
};
exports.findUsers = findUsers;
