import { Router } from 'express';
import { getLogEntries  } from '../controllers/logController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', verifyToken, getLogEntries);


export default router;
