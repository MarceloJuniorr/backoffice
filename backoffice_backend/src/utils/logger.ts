import { pool } from '../../config/db'; // Conexão com o banco de dados

export const logAction = async (message: string, username: string) => {
  try {
    const logMessage = `${new Date().toISOString()} - ${message} - Usuário: ${username}`;

    // Inserir o log no banco de dados
    await pool.query('INSERT INTO logs (message) VALUES (?)', [logMessage]);

    console.log('Log gravado no banco de dados.');
  } catch (error) {
    console.error('Erro ao gravar log no banco de dados:', error);
  }
};