import prisma from './prismaClient';

export interface User {
  id: number,
  role: string,
  username: string
}

// Criar um novo usuário
export const createUser = async (userData: any) => {
  const user = await prisma.user.create({
    data: {
      username: userData.username,
      password: userData.password, // Lembre-se de criptografar a senha
      role: userData.role || 'USER',
    },
  });
  return user;
};

// Buscar usuário por nome
export const findUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return user;
};

export const findUsers = async () => {
  const user = await prisma.user.findMany();
  return user;
};