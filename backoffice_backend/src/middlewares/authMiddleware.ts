import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const TokenSchema = z.object({
  id: z.number(),
  role: z.string(),
});
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const validationResult = TokenSchema.safeParse(decoded);

    if (!validationResult.success) {
      return res.status(400).json({ message: 'Token inválido.', errors: validationResult.error.format() });
    }

    req.user = validationResult.data; // Dados validados e seguros
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};
