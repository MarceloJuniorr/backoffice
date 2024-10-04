import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, Spacer, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { FaMoneyBill, FaCheckCircle, FaTimesCircle, FaWallet, FaCopy, FaRegMoneyBillAlt, FaEdit, FaPlus } from 'react-icons/fa';
import useAxios from '../api';
import moment from 'moment';
import { DateRangePicker, RangeValue, DateValue } from '@nextui-org/react';
import { parseAbsoluteToLocal } from '@internationalized/date';

interface Payment {
  id: number;
  supplierId: number;
  description: string;
  amount: number;
  dueDate: string;
  status: string;
  boletoCode: string;
  paymentType: string;
  store: string;
  paymentDate: string;
}

interface Supplier {
  id: number;
  name: string;
  cnpj: string;
}

const PaymentPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [newPayment, setNewPayment] = useState<Payment>({
    id: 0,
    supplierId: 0,
    description: '',
    amount: 0,
    dueDate: '',
    status: 'Aberto',
    boletoCode: '',
    paymentType: 'Boleto',
    store: 'Supermercado',
    paymentDate: '',
  });
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [supplierSearch, setSupplierSearch] = useState<string>(''); // Campo para busca de fornecedor
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
    start: parseAbsoluteToLocal(moment().startOf('month').toISOString()), 
    end: parseAbsoluteToLocal(moment().endOf('month').toISOString()), 
  });

  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

  const api = useAxios();

  const convertToJSDate = (dateValue: DateValue | undefined) => {
    if (dateValue) {
      return dateValue.toDate("America/Sao_Paulo");
    }
    return null;
  };

  const fetchSuppliers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/suppliers', {
        headers: { authorization: token },
      });
      setSuppliers(response.data);
      setFilteredSuppliers(response.data); // Inicialmente, a lista de fornecedores filtrados é igual à original
    } catch (error) {
      console.error('Erro ao buscar fornecedores', error);
    }
  }, [api]);

  const fetchPayments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/payments', {
        headers: { authorization: token },
      });
      setPayments(response.data);
      setFilteredPayments(response.data);
    } catch (error) {
      console.error('Erro ao buscar pagamentos', error);
    }
  }, [api]);

  useEffect(() => {
    const filtered = payments.filter(payment => {
      const paymentDate = moment(payment.dueDate);
      const isInDateRange = paymentDate.isBetween(
        moment(convertToJSDate(dateRange.start)),
        moment(convertToJSDate(dateRange.end)),
        'day',
        '[]'
      );
      const matchesStatus = selectedStatus === 'Todos' || payment.status === selectedStatus;

      return isInDateRange && matchesStatus;
    });

    setFilteredPayments(filtered);
  }, [payments, dateRange, selectedStatus]);

  const handleAddPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/payments', newPayment, {
        headers: { authorization: token },
      });
      setAddModalOpen(false);
      fetchPayments();
    } catch (error) {
      console.error('Erro ao adicionar pagamento', error);
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedPayment) return;
    try {
      const token = localStorage.getItem('token');
      await api.put(`/payments/${selectedPayment.id}`, selectedPayment, {
        headers: { authorization: token },
      });
      setEditModalOpen(false);
      fetchPayments();
    } catch (error) {
      console.error('Erro ao atualizar pagamento', error);
    }
  };

  const markAsPaid = async (item: Payment) => {
    try {
      const token = localStorage.getItem('token');
      item.status = 'Pago';
      item.paymentDate = moment().toISOString(); 
      await api.put(`/payments/${item.id}`, item, {
        headers: { authorization: token },
      });
      fetchPayments();
    } catch (error) {
      console.error('Erro ao marcar pagamento como pago', error);
    }
  };

  const copyBoletoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Código do boleto copiado!');
  };

  const openEditModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setEditModalOpen(true);
  };

  const handleSupplierSearch = (searchText: string) => {
    setSupplierSearch(searchText);
    const filtered = suppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
        supplier.cnpj.includes(searchText)
    );
    setFilteredSuppliers(filtered); // Atualiza a lista de fornecedores filtrados
  };

  const totalPayments = filteredPayments.length;
  const totalPaid = filteredPayments.filter(p => p.status === 'Pago').reduce((acc, p) => acc + p.amount, 0);
  const totalOpen = filteredPayments.filter(p => p.status === 'Aberto').reduce((acc, p) => acc + p.amount, 0);
  const totalAmount = filteredPayments.reduce((acc, p) => acc + p.amount, 0);

  useEffect(() => {
    fetchSuppliers();
    fetchPayments();
  }, [fetchPayments, fetchSuppliers]);

  const paymentTypes = ['Boleto', 'Cartão de Crédito', 'Transferência', 'Dinheiro'];
  const stores = ['Supermercado', 'Distribuidora Atacado', 'Empório'];

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl">Contas a Pagar</h2>
      </div>

      {/* Totalizadores com Ícones */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-500 text-white">
          <div className="flex items-center justify-between">
            <FaMoneyBill size={32} />
            <div className="text-right">
              <p className="text-sm">Total de Pagamentos</p>
              <p className="text-2xl font-bold">{totalPayments}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-green-500 text-white">
          <div className="flex items-center justify-between">
            <FaCheckCircle size={32} />
            <div className="text-right">
              <p className="text-sm">Total Pago</p>
              <p className="text-2xl font-bold">R$ {totalPaid.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-red-500 text-white">
          <div className="flex items-center justify-between">
            <FaTimesCircle size={32} />
            <div className="text-right">
              <p className="text-sm">Total em Aberto</p>
              <p className="text-2xl font-bold">R$ {totalOpen.toFixed(2)}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-yellow-500 text-white">
          <div className="flex items-center justify-between">
            <FaWallet size={32} />
            <div className="text-right">
              <p className="text-sm">Valor Total</p>
              <p className="text-2xl font-bold">R$ {totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DateRangePicker 
          aria-label="Selecionar intervalo de datas" 
          value={dateRange} 
          onChange={setDateRange} 
        />
        <Dropdown aria-label="Selecionar status do pagamento">
          <DropdownTrigger>
            <Button variant="bordered">{selectedStatus}</Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Seleção de status"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedStatus}
            onSelectionChange={(keys) => {setSelectedStatus(Array.from(keys).join(''))}}
          >
            <DropdownItem key="Todos">Todos</DropdownItem>
            <DropdownItem key="Aberto">Aberto</DropdownItem>
            <DropdownItem key="Pago">Pago</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button onClick={() => setAddModalOpen(true)} startContent={<FaPlus />} aria-label="Adicionar nova conta a pagar">
          Adicionar Conta a Pagar
        </Button>
      </div>

      <Table aria-label="Tabela de contas a pagar">
        <TableHeader>
          <TableColumn>Fornecedor</TableColumn>
          <TableColumn>Valor</TableColumn>
          <TableColumn>Data de Vencimento</TableColumn>
          <TableColumn>Status</TableColumn>
          <TableColumn>Ações</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredPayments.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{suppliers.find(s => s.id === item.supplierId)?.name || 'N/A'}</TableCell>
              <TableCell>R$ {item.amount.toFixed(2)}</TableCell>
              <TableCell>{moment(item.dueDate).format('DD/MM/YYYY')}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>
                <Button size="sm" onClick={() => openEditModal(item)} aria-label="Editar pagamento">
                  <FaEdit />
                </Button>
                <Button size="sm" onClick={() => item.boletoCode && copyBoletoCode(item.boletoCode)} aria-label="Copiar código do boleto">
                  <FaCopy />
                </Button>
                {item.status !== 'Pago' && (
                  <Button size="sm" onClick={() => markAsPaid(item)} aria-label="Marcar como pago">
                    <FaRegMoneyBillAlt />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal Adicionar */}
      <Modal isOpen={isAddModalOpen} onOpenChange={setAddModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Adicionar Conta a Pagar</ModalHeader>
              <ModalBody>
                <Input
                  label="Buscar Fornecedor"
                  placeholder="Nome ou CNPJ"
                  value={supplierSearch}
                  onChange={(e) => handleSupplierSearch(e.target.value)}
                  fullWidth
                  aria-label="Campo de busca de fornecedor"
                />
                <Dropdown aria-label="Selecionar fornecedor">
                  <DropdownTrigger>
                    <Button variant="bordered">{suppliers.find(s => s.id === newPayment.supplierId)?.name || 'Selecione um Fornecedor'}</Button>
                  </DropdownTrigger>
                  <DropdownMenu onSelectionChange={(keys) => setNewPayment({ ...newPayment, supplierId: Number(Array.from(keys).join('')) })}>
                    {filteredSuppliers.map((supplier) => (
                      <DropdownItem key={supplier.id}>{supplier.name} - {supplier.cnpj}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Spacer y={1} />
                <Input
                  label="Valor"
                  placeholder="Valor"
                  type="number"
                  value={newPayment.amount.toString()}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: parseFloat(e.target.value) })}
                  fullWidth
                  aria-label="Campo de valor"
                />
                <Spacer y={1} />
                <Input
                  label="Data de Vencimento"
                  type="date"
                  value={newPayment.dueDate}
                  onChange={(e) => setNewPayment({ ...newPayment, dueDate: e.target.value })}
                  fullWidth
                  aria-label="Campo de data de vencimento"
                />
                <Spacer y={1} />
                <Input
                  label="Código do Boleto"
                  value={newPayment.boletoCode}
                  onChange={(e) => setNewPayment({ ...newPayment, boletoCode: e.target.value })}
                  fullWidth
                  aria-label="Campo de código do boleto"
                />
                <Spacer y={1} />
                <Dropdown aria-label="Selecionar tipo de pagamento">
          <DropdownTrigger>
            <Button variant="bordered">{newPayment.paymentType}</Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Selecione o tipo de pagamento"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={newPayment.paymentType}
            onSelectionChange={(keys) => {setNewPayment({...newPayment, paymentType: Array.from(keys).join('')})}}
          >
                    {paymentTypes.map((types) => (
                      <DropdownItem key={types}>{types}</DropdownItem>
                    ))}
          </DropdownMenu>
        </Dropdown>
                <Spacer y={1} />
                <Dropdown aria-label="Selecionar loja">
                  <DropdownTrigger>
                    <Button variant="bordered">{newPayment.store}</Button>
                  </DropdownTrigger>
                  <DropdownMenu 
                                aria-label="Selecione a loja"
                                variant="flat"
                                disallowEmptySelection
                                selectionMode="single"
                                selectedKeys={newPayment.store}
                  
                    onSelectionChange={(keys) => setNewPayment({ ...newPayment, store: Array.from(keys).join('') })}>
                    {stores.map((store) => (
                      <DropdownItem key={store}>{store}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleAddPayment}>Adicionar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal Editar */}
      <Modal isOpen={isEditModalOpen} onOpenChange={setEditModalOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Editar Conta a Pagar</ModalHeader>
              <ModalBody>
              <Dropdown aria-label="Selecionar fornecedor">
                <DropdownTrigger>
                  <Button variant="bordered">
                    {suppliers.find(s => s.id === newPayment.supplierId)?.name || 'Selecione um Fornecedor'}
                  </Button>
                </DropdownTrigger>
              <DropdownMenu 
                  aria-label="Lista de fornecedores"
                  onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys).join(''); // Garantir que selecionamos o valor
                  setNewPayment({ ...newPayment, supplierId: Number(selectedKey) });
    }}
  >
    {filteredSuppliers.map((supplier) => (
      <DropdownItem key={supplier.id}>{supplier.name} - {supplier.cnpj}</DropdownItem>
    ))}
  </DropdownMenu>
</Dropdown>
                <Spacer y={1} />
                <Input
                  label="Valor"
                  type="number"
                  value={selectedPayment?.amount.toString() || ''}
                  onChange={(e) => setSelectedPayment({ ...selectedPayment!, amount: parseFloat(e.target.value) })}
                  fullWidth
                  aria-label="Campo de valor"
                />
                <Spacer y={1} />
                <Input
                  label="Data de Vencimento"
                  type="date"
                  value={selectedPayment?.dueDate || ''}
                  onChange={(e) => setSelectedPayment({ ...selectedPayment!, dueDate: e.target.value })}
                  fullWidth
                  aria-label="Campo de data de vencimento"
                />
                <Spacer y={1} />
                <Input
                  label="Código do Boleto"
                  value={selectedPayment?.boletoCode || ''}
                  onChange={(e) => setSelectedPayment({ ...selectedPayment!, boletoCode: e.target.value })}
                  fullWidth
                  aria-label="Campo de código do boleto"
                />
                <Spacer y={1} />
<Dropdown aria-label="Selecionar tipo de pagamento">
  <DropdownTrigger>
    <Button variant="bordered">{newPayment.paymentType}</Button>
  </DropdownTrigger>
  <DropdownMenu 
    aria-label="Tipos de pagamento"
    onSelectionChange={(keys) => {
      const selectedKey = Array.from(keys).join(''); // Converter o Set em string
      setNewPayment({ ...newPayment, paymentType: selectedKey });
    }}
  >
    {paymentTypes.map((type) => (
      <DropdownItem key={type}>{type}</DropdownItem>
    ))}
  </DropdownMenu>
</Dropdown>
                <Spacer y={1} />
                <Dropdown aria-label="Selecionar loja">
                  <DropdownTrigger>
                    <Button variant="bordered">{selectedPayment?.store || 'Selecione a Loja'}</Button>
                  </DropdownTrigger>
                  <DropdownMenu onSelectionChange={(keys) => setSelectedPayment({ ...selectedPayment!, store: Array.from(keys).join('') })}>
                    {stores.map((store) => (
                      <DropdownItem key={store}>{store}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleUpdatePayment}>Salvar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PaymentPage;
