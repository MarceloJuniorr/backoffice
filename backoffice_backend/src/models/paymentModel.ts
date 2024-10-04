import { Prisma } from '@prisma/client';
import prisma from './prismaClient';

// Função utilitária para remover o tempo de uma data e definir como 00:00:00
const getDateOnly = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

// Criar um novo pagamento (já existe)
export const createPayment = async (paymentData: Prisma.PaymentCreateManyInput) => {
  const payment = await prisma.payment.create({
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

// Atualizar um pagamento existente
export const updatePaymentEntry = async (id: number, paymentData: Prisma.PaymentUpdateInput ) => {
  const updatedPayment = await prisma.payment.update({
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

// Obter todos os pagamentos (já existe)
export const getPayments = async () => {
  const payments = await prisma.payment.findMany();
  return payments;
};
