"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupplierEntries = exports.createSupplierEntry = void 0;
const supplierModel_1 = require("../models/supplierModel");
// Criar um novo fornecedor
const createSupplierEntry = async (req, res) => {
    const supplier = await (0, supplierModel_1.createSupplier)(req.body);
    res.status(201).json(supplier);
};
exports.createSupplierEntry = createSupplierEntry;
// Obter todos os fornecedores
const getSupplierEntries = async (_req, res) => {
    const suppliers = await (0, supplierModel_1.getSuppliers)();
    res.status(200).json(suppliers);
};
exports.getSupplierEntries = getSupplierEntries;
