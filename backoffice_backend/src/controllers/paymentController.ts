import { Request, Response } from 'express';
import { createPayment, getPayments, updatePaymentEntry as updatePaymentEntryModel } from '../models/paymentModel';

// Criar um novo pagamento
export const createPaymentEntry = async (req: Request, res: Response) => {
  try {
    const payment = await createPayment(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar lançamento de pagamento' });
  }
};

// Obter todos os pagamentos
export const getPaymentEntries = async (_req: Request, res: Response) => {
  try {
    const payments = await getPayments();
    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao buscar lançamentos' });
  }
};

// Atualizar um pagamento existente
export const updatePaymentEntry = async (req: Request, res: Response) => {
  try {
    const updatedPayment = await updatePaymentEntryModel(parseInt(req.params.id), req.body);
    res.status(200).json(updatedPayment);
  } catch (error) {
    console.log(error);
    
    res.status(400).json({ error: 'Erro ao atualizar pagamento' });
  }
};
