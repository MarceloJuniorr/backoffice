import { Router } from 'express';
import { createPaymentEntry, getPaymentEntries, updatePaymentEntry, deletePaymentEntry } from '../controllers/paymentController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', verifyToken, createPaymentEntry);
router.get('/', verifyToken, getPaymentEntries);
router.put('/:id', verifyToken, updatePaymentEntry);
router.delete('/:id', verifyToken, deletePaymentEntry);


export default router;
