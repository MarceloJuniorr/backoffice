import { createSupplier, getSuppliers as getSuppliersModel } from '../models/supplierModel';

export const createSupplierEntry = async (supplierData: any) => {
  return await createSupplier(supplierData);
};

export const getSuppliers = async () => {
  return await getSuppliersModel();
};
