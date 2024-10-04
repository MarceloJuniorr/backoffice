"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuppliers = exports.createSupplier = void 0;
const prismaClient_1 = __importDefault(require("./prismaClient"));
// Criar um novo fornecedor
const createSupplier = async (supplierData) => {
    const supplier = await prismaClient_1.default.supplier.create({
        data: {
            name: supplierData.name,
            cnpj: supplierData.cnpj,
            address: supplierData.address,
        },
    });
    return supplier;
};
exports.createSupplier = createSupplier;
// Obter todos os fornecedores
const getSuppliers = async () => {
    const suppliers = await prismaClient_1.default.supplier.findMany();
    return suppliers;
};
exports.getSuppliers = getSuppliers;
