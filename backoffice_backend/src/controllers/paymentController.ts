import { Request, Response } from 'express';
import { createPayment, getPayments, updatePaymentEntry as updatePaymentEntryModel, deletePayment} from '../models/paymentModel';
import { createLogEntry } from '../utils/logger';

const convertToISODateTime = (dateString: string): string => {
  // Adiciona "T00:00:00Z" para completar o formato ISO-8601 com o tempo
  return new Date(dateString).toISOString();
};
// Criar um novo pagamento
export const createPaymentEntry = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    console.log(req.user);
    
    createLogEntry(req.originalUrl, req.method,'' ,JSON.stringify(req.body), req.user?.username)
    
    const payment = await createPayment(req.body);
    res.status(201).json(payment);
  } catch (error) {

    console.log(error);

    res.status(400).json({ error: error });
  }
};

// Obter todos os pagamentos
export const getPaymentEntries = async (_req: Request, res: Response) => {
  try {
    const payments = await getPayments();
    res.status(200).json(payments);
  } catch (error) {
    console.log(error);

    res.status(400).json({ error: 'Erro ao buscar lançamentos' });
  }
};

// Atualizar um pagamento existente
export const updatePaymentEntry = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    createLogEntry(req.originalUrl, req.method,req.params.id.toString() ,JSON.stringify(req.body), req.user?.username)

    req.body = {
      ...req.body,
      paymentDate: req.body.paymentDate === '' ? null : req.body.paymentDate
    }
    const updatedPayment = await updatePaymentEntryModel(parseInt(req.params.id), req.body);
    res.status(200).json(updatedPayment);
  } catch (error) {
    console.log(error);
    
    res.status(400).json({ error: 'Erro ao atualizar pagamento' });
  }
};

export const deletePaymentEntry = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    createLogEntry(req.originalUrl, req.method,req.params.id.toString() ,JSON.stringify(req.body), req.user?.username)

    req.body = {
      ...req.body,
      paymentDate: req.body.paymentDate === '' ? null : req.body.paymentDate
    }
    const deletedPayment = await deletePayment(parseInt(req.params.id), req.body);
    res.status(200).json(deletedPayment);
  } catch (error) {
    console.log(error);
    
    res.status(400).json({ error: 'Erro ao atualizar pagamento' });
  }
};
  