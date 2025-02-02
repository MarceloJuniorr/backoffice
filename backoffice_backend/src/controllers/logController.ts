import { Request, Response } from 'express';
import { getLogs  } from '../models/logModel';

export const getLogEntries = async (_req: Request, res: Response) => {
  const logs = await getLogs();
  res.status(200).json(logs);
};
