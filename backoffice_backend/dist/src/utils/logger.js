"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAction = void 0;
const db_1 = require("../../config/db"); // Conexão com o banco de dados
const logAction = async (message, username) => {
    try {
        const logMessage = `${new Date().toISOString()} - ${message} - Usuário: ${username}`;
        // Inserir o log no banco de dados
        await db_1.pool.query('INSERT INTO logs (message) VALUES (?)', [logMessage]);
        console.log('Log gravado no banco de dados.');
    }
    catch (error) {
        console.error('Erro ao gravar log no banco de dados:', error);
    }
};
exports.logAction = logAction;
