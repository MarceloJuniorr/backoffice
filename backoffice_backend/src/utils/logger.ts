import { PrismaClient } from '@prisma/client';
import moment from 'moment-timezone';

const prisma = new PrismaClient();

export async function createLogEntry(
endpoint: string, type: string, idparams: string | null, body: string | null, username: string | undefined | null,
) {
  try {
    const createdAt = moment.tz('America/Sao_Paulo').toDate();    
    const user = username || ''
    await prisma.log.create({
      data: {
        endpoint,
        type,
        idparams,
        body,
        user,
        createdAt
      },
    });
  } catch (logError) {
    console.error('Erro ao criar entrada de log:', logError);
    // Lide com o erro de log, se necessário (ex: registrar em outro lugar)
  }
}