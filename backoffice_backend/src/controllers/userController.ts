import { Request, Response } from 'express';
import { createUser, findUserByUsername, findUsers as findUsersModel } from '../models/userModel';
import bcrypt from 'bcryptjs';

// Criar um novo usuário
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

  res.status(201).json(user);
};

export const findUsers = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  // Verificar se o usuário já existe
  const existingUser = await findUsersModel();

  res.status(201).json(existingUser);
};