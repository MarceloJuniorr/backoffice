import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByUsername, createUser } from '../models/userModel';
import { Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // Certifique-se de definir isso no arquivo .env

// Registrar um novo usuário
export const registerUser = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  
  // Verificar se o usuário já existe
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ error: 'Usuário já existe.' });
  }

  // Criptografar a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criar o usuário
  const user = await createUser({
    username,
    password: hashedPassword,
    role,
  });

  res.status(201).json({ message: 'Usuário registrado com sucesso', user });
};

// Login de usuário
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Buscar o usuário pelo nome
  const user = await findUserByUsername(username);
  if (!user) {
    return res.status(400).json({ error: 'Usuário não encontrado.' });
  }

  // Verificar a senha
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Senha incorreta.' });
  }

  // Gerar token JWT
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({ message: 'Login bem-sucedido', token });
};
