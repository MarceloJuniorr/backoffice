"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuppliers = exports.createSupplierEntry = void 0;
const supplierModel_1 = require("../models/supplierModel");
const createSupplierEntry = async (supplierData) => {
    return await (0, supplierModel_1.createSupplier)(supplierData);
};
exports.createSupplierEntry = createSupplierEntry;
const getSuppliers = async () => {
    return await (0, supplierModel_1.getSuppliers)();
};
exports.getSuppliers = getSuppliers;
