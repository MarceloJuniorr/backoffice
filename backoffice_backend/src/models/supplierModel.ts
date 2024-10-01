import prisma from './prismaClient';

// Criar um novo fornecedor
export const createSupplier = async (supplierData: any) => {
  const supplier = await prisma.supplier.create({
    data: {
      name: supplierData.name,
      cnpj: supplierData.cnpj,
      address: supplierData.address,
    },
  });
  return supplier;
};

// Obter todos os fornecedores
export const getSuppliers = async () => {
  const suppliers = await prisma.supplier.findMany();
  return suppliers;
};
