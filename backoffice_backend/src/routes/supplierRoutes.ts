import { Router } from 'express';
import { createSupplierEntry, getSupplierEntries } from '../controllers/supplierController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', verifyToken, createSupplierEntry);
router.get('/', verifyToken, getSupplierEntries);

export default router;
