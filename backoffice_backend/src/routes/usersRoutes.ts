import { Router } from 'express';
import { findUsers } from '../controllers/userController';
import { verifyToken } from '../middlewares/authMiddleware';


const router = Router();

router.get('/', verifyToken , findUsers);


export default router;
