import { Prisma } from '@prisma/client';
import prisma from './prismaClient';


export const getLogs = async () => {
  const logs = await prisma.log.findMany();
  return logs;
};

