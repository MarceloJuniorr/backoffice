"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayments = exports.updatePaymentEntry = exports.createPayment = void 0;
const prismaClient_1 = __importDefault(require("./prismaClient"));
// Função utilitária para remover o tempo de uma data e definir como 00:00:00
const getDateOnly = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
// Criar um novo pagamento (já existe)
const createPayment = async (paymentData) => {
    const payment = await prismaClient_1.default.payment.create({
        data: {
            supplierId: paymentData.supplierId,
            paymentType: paymentData.paymentType,
            amount: paymentData.amount,
            dueDate: getDateOnly(new Date(paymentData.dueDate)), // Grava somente a data
            store: paymentData.store,
            status: paymentData.status,
            description: paymentData.description,
            boletoCode: paymentData.boletoCode,
        },
    });
    return payment;
};
exports.createPayment = createPayment;
// Atualizar um pagamento existente
const updatePaymentEntry = async (id, paymentData) => {
    const updatedPayment = await prismaClient_1.default.payment.update({
        where: { id: id },
        data: {
            supplierId: paymentData.supplierId,
            paymentType: paymentData.paymentType,
            amount: paymentData.amount,
            dueDate: paymentData.dueDate, // Atualiza a data, se fornecida
            store: paymentData.store,
            status: paymentData.status,
            description: paymentData.description,
            boletoCode: paymentData.boletoCode,
            paymentDate: paymentData.paymentDate
        },
    });
    return updatedPayment;
};
exports.updatePaymentEntry = updatePaymentEntry;
// Obter todos os pagamentos (já existe)
const getPayments = async () => {
    const payments = await prismaClient_1.default.payment.findMany();
    return payments;
};
exports.getPayments = getPayments;
