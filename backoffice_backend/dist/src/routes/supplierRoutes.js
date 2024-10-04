"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplierController_1 = require("../controllers/supplierController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/', authMiddleware_1.verifyToken, supplierController_1.createSupplierEntry);
router.get('/', authMiddleware_1.verifyToken, supplierController_1.getSupplierEntries);
exports.default = router;
