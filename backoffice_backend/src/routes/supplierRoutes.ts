import { Router } from 'express';
import { createSupplierEntry, getSupplierEntries, updateSupplierEntries  } from '../controllers/supplierController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', verifyToken, createSupplierEntry);
router.get('/', verifyToken, getSupplierEntries);
router.put('/:id', verifyToken, updateSupplierEntries);


export default router;
