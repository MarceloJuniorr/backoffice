import { Router } from 'express';
import { createPaymentEntry, getPaymentEntries, updatePaymentEntry } from '../controllers/paymentController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', verifyToken, createPaymentEntry);
router.get('/', verifyToken, getPaymentEntries);
router.put('/:id', verifyToken, updatePaymentEntry);

export default router;
