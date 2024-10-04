"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentEntry = exports.getPaymentEntries = exports.createPaymentEntry = void 0;
const paymentModel_1 = require("../models/paymentModel");
const convertToISODateTime = (dateString) => {
    // Adiciona "T00:00:00Z" para completar o formato ISO-8601 com o tempo
    return new Date(dateString).toISOString();
};
// Criar um novo pagamento
const createPaymentEntry = async (req, res) => {
    try {
        const payment = await (0, paymentModel_1.createPayment)(req.body);
        res.status(201).json(payment);
    }
    catch (error) {
        res.status(400).json({ error: 'Erro ao criar lançamento de pagamento' });
    }
};
exports.createPaymentEntry = createPaymentEntry;
// Obter todos os pagamentos
const getPaymentEntries = async (_req, res) => {
    try {
        const payments = await (0, paymentModel_1.getPayments)();
        res.status(200).json(payments);
    }
    catch (error) {
        res.status(400).json({ error: 'Erro ao buscar lançamentos' });
    }
};
exports.getPaymentEntries = getPaymentEntries;
// Atualizar um pagamento existente
const updatePaymentEntry = async (req, res) => {
    try {
        console.log(typeof (req.body.paymentDate));
        req.body = {
            ...req.body,
            dueDate: convertToISODateTime(req.body.dueDate),
            paymentDate: req.body.paymentDate === '' ? null : req.body.paymentDate
        };
        const updatedPayment = await (0, paymentModel_1.updatePaymentEntry)(parseInt(req.params.id), req.body);
        res.status(200).json(updatedPayment);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Erro ao atualizar pagamento' });
    }
};
exports.updatePaymentEntry = updatePaymentEntry;
