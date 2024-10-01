import { Request, Response } from 'express';
import { createSupplier, getSuppliers } from '../models/supplierModel';

// Criar um novo fornecedor
export const createSupplierEntry = async (req: Request, res: Response) => {
  const supplier = await createSupplier(req.body);
  res.status(201).json(supplier);
};

// Obter todos os fornecedores
export const getSupplierEntries = async (_req: Request, res: Response) => {
  const suppliers = await getSuppliers();
  res.status(200).json(suppliers);
};
