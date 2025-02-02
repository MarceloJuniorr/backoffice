import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Card, Spacer, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, CardHeader } from '@nextui-org/react';
import { FaMoneyBill, FaCheckCircle, FaTimesCircle, FaWallet, FaCopy, FaPlus, FaTrash  } from 'react-icons/fa';
import useAxios from '../api';
import moment from 'moment';
import { DateRangePicker, RangeValue, DateValue } from '@nextui-org/react';
import { parseDate } from '@internationalized/date';
import { EditIcon } from '../components/Icons';
import TableComponent from '../components/Table';
import { IconType } from 'react-icons';
// @ts-ignore
import { confirmAlert } from 'react-confirm-alert'; // Importa o método principal
import 'react-confirm-alert/src/react-confirm-alert.css'; // Importa os estilos

interface Payment {
  id: number;
  supplierId: number;
  description: string;
  amount: string;
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
interface DataItem {
  amount: string;
  boletoCode: string;
  description: string;
  dueDate: string;
  id: number;
  paymentDate: string;
  paymentType: string;
  status: string;
  store: string;
  supplierId: number;
  supplier: string;

}

const cardComponent = (icon: IconType, title: string, value: string, color: string) => (
  <Card className={`border-none ${color} text-white`}> {/* Cor dinâmica */}
    <CardHeader className="justify-between" style={{ paddingBottom: 0 }}>
      {/* Renderizando o ícone passado como parâmetro */}
      {React.createElement(icon, { size: 32 })}
      <h4 className="font-bold text-large">{title}</h4>
    </CardHeader>
    <div className="flex items-center justify-center">
      <div className="text-right">
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </Card>
);

const columns = [
  { uid: "id", name: "ID", sortable: true },
  { uid: "description", name: "Descrição", sortable: true, hiddenOnMobile: true },
  { uid: "amount", name: "Valor", sortable: true },
  //  { uid: "boletoCode", name: "Código do Boleto", sortable: true, hiddenOnMobile: true },
  { uid: "dueDate", name: "Data de Vencimento", sortable: true, isDate: true },
  { uid: "paymentType", name: "Tipo de Pagamento", sortable: true, hiddenOnMobile: true }, // Esconder em mobile
  { uid: "status", name: "Status", sortable: true },
  { uid: "store", name: "Loja", sortable: true, hiddenOnMobile: true }, // Esconder em mobile
  { uid: "supplier", name: "Fornecedor", sortable: true, hiddenOnMobile: true },
  { uid: "actions", name: "Ações" },
];

const getDate = (date: Date, days: number = 0): string => {
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0]; // Formata para 'YYYY-MM-DD'
};
const newPaymentInitial = {
  id: 0,
  supplierId: 0,
  description: '',
  amount: '',
  dueDate: '',
  status: 'Aberto',
  boletoCode: '',
  paymentType: 'Boleto',
  store: 'Supermercado',
  paymentDate: '',
}

const PaymentPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [newPayment, setNewPayment] = useState<Payment>(newPaymentInitial);
  const [selectedPayment, setSelectedPayment] = useState<Payment>({
    id: 0,
    supplierId: 0,
    description: '',
    amount: '',
    dueDate: '',
    status: 'Aberto',
    boletoCode: '',
    paymentType: 'Boleto',
    store: 'Supermercado',
    paymentDate: '',
  });
  const [supplierSearch, setSupplierSearch] = useState<string>(''); // Campo para busca de fornecedor
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
    start: parseDate(getDate(new Date())),
    end: parseDate(getDate(new Date(), 7)),
  });

  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');
  const [selectedPaymentType, setSelectedPaymentType] = useState<string>('Todos');


  const api = useAxios();

  const convertToJSDate = (dateValue: DateValue | undefined) => {
    if (dateValue) {
      return dateValue.toDate("America/Sao_Paulo");
    }
    return null;
  };

  const formatCurrency = (value: string | number) => {
    // Remove qualquer caractere que não seja número
    const stringValue = typeof value === 'number' ? value.toFixed(2) : value;

    const numericValue = stringValue.replace(/\D/g, '');

    // Converte o valor em centavos e formata
    const formattedValue = (Number(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return formattedValue;
  };

  const parseCurrency = (value: string | number) => {
    // Converter o valor para string caso seja um número
    const stringValue = typeof value === 'number' ? value.toFixed(2) : value;

    // Remove símbolos de moeda e pontuações
    const numericValue = stringValue.replace(/\D/g, '');
    return Number((Number(numericValue) / 100).toFixed(2)); // Retorna o valor numérico em formato decimal
  };

  const fetchSuppliers = useMemo(async () => {
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
      const deletePayment = async (item: Payment) => {
        try {
          const token = localStorage.getItem('token');
      
          if (item.status === 'Pago') {
            alert('Não é possível excluir um pagamento concluído!');
            return;
          }
      
          confirmAlert({
            title: 'Confirmação',
            message: `Deseja excluir o pagamento de ${item.description}?`,
            buttons: [
              {
                label: 'Sim, Excluir',
                onClick: async () => { // Adicione o async aqui
                  try {
                    await api.delete(`/payments/${item.id}`, {
                      headers: { authorization: token },
                    });
                    fetchPayments();
                    alert('Pagamento excluído com sucesso!');
                  } catch (error) {
                    console.error('Erro ao excluir pagamento', error);
                    alert('Ocorreu um erro ao excluir o pagamento. Tente novamente.');
                  }
                }
              },
              {
                label: 'Não, Cancelar',
                onClick: () => {
                  // Ação para o botão "Não" (opcional)
                  console.log('Exclusão cancelada.');
                }
              }
            ]
          });
      
        } catch (error) {
          console.error('Erro ao processar exclusão', error); // Erro fora do confirmAlert
        }
      };
      const token = localStorage.getItem('token');
      const response = await api.get('/payments', {
        headers: { authorization: token },
      });
      const updatedData = response.data.map((item: DataItem) => ({
        ...item,
        paymentDate: item.paymentDate ? getDate(new Date(item.paymentDate)) : '',
        supplier: suppliers.find(s => s.id === item.supplierId)?.name || 'N/A',
        amount: formatCurrency(item.amount),
        actions: [
          {
            icon: <FaCopy />,
            tooltip: "Copiar Boleto",
            onClick: () => copyBoletoCode(item.boletoCode),
          },
          {
            icon: <EditIcon />,
            tooltip: "Editar",
            onClick: () => openEditModal(item),
          },
          {
            icon: <FaCheckCircle />,
            tooltip: "Marcar como Pago",
            onClick: () => markAsPaid(item),
          },          {
            icon: <FaTrash />,
            tooltip: "Apagar Registro",
            onClick: () => deletePayment(item),
          },
        ],
      }));
      setPayments(updatedData);
      setFilteredPayments(response.data);
    } catch (error) {
      console.error('Erro ao buscar pagamentos', error);
    }
  }, [api, suppliers]);

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

      const matchesPaymentTypes = selectedPaymentType === 'Todos' || payment.paymentType === selectedPaymentType;


      return isInDateRange && matchesStatus && matchesPaymentTypes;
    });

    setFilteredPayments(filtered);
  }, [payments, dateRange, selectedStatus, selectedPaymentType]);

  const handleAddPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const addPayment = { ...newPayment, amount: parseCurrency(newPayment.amount) };
      console.log(addPayment)

      await api.post('/payments', addPayment, {
        headers: { authorization: token },
      });
      setAddModalOpen(false);
      setNewPayment(newPaymentInitial)
      fetchPayments();
    } catch (error) {
      console.error('Erro ao adicionar pagamento', error);
    }
  };

  const handleUpdatePayment = async () => {
    if (!selectedPayment) return;
    try {
      const token = localStorage.getItem('token');
      const updatedPayment = { ...selectedPayment, amount: parseCurrency(selectedPayment.amount) };
      await api.put(`/payments/${selectedPayment.id}`, updatedPayment, {
        headers: { authorization: token },
      });
      setEditModalOpen(false);
      fetchPayments();
    } catch (error) {
      console.error('Erro ao atualizar pagamento', error);
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
  const totalPaid = filteredPayments.filter(p => p.status === 'Pago').reduce((acc, p) => acc + Number(parseCurrency(p.amount)), 0);
  const totalOpen = filteredPayments.filter(p => p.status === 'Aberto').reduce((acc, p) => Number(acc + parseCurrency(p.amount)), 0);
  const totalAmount = filteredPayments.reduce((acc, p) => acc + Number(parseCurrency(p.amount)), 0);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments, fetchSuppliers]);

  const paymentTypes = ['Boleto', 'Cartão de Crédito', 'Transferência', 'Dinheiro'];
  const paymentTypesFilter = ['Todos', ...paymentTypes];

  const stores = ['Supermercado', 'Distribuidora Atacado', 'Empório'];


  // Função para validar boleto e extrair dados
  const validateBoleto = () => {
    const boletoCode = newPayment.boletoCode;

    // Verifica se o código do boleto foi inserido e se tem o tamanho adequado
    if (!boletoCode || boletoCode.length < 47) {
      console.error('Código de boleto inválido');
      return;
    }

    try {
      // Extração do fator de vencimento e valor do boleto
      const vencimentoFactor = boletoCode.substring(33, 37); // Fator de vencimento
      const valor = boletoCode.substring(37); // Valor do boleto (últimos dígitos)

      // Data base para cálculos de vencimento de boletos
      const baseDate = new Date(1997, 9, 7); // Data base 07/10/1997
      const vencimento = new Date(baseDate.getTime() + (Number(vencimentoFactor) * 24 * 60 * 60 * 1000));

      // Formatar o valor do boleto usando a função de formatação
      const formattedValue = formatCurrency((parseFloat(valor) / 100).toString());

      // Atualiza o estado newPayment com o valor e a data de vencimento formatados
      setNewPayment({
        ...newPayment,
        amount: formattedValue,  // Aplica a máscara de moeda
        dueDate: vencimento.toISOString().split('T')[0],  // Formata a data no formato YYYY-MM-DD
      });

      console.log('Boleto validado com sucesso');
    } catch (error) {
      console.error('Erro ao validar o boleto', error);
    }
  };



  return (
    <Card style={{ maxWidth: '1150px', padding: '15px', margin: 'auto', marginTop: '25px' }}>
      <div className="flex justify-center items-center mb-4">
        <h2 className="text-3xl font-bold">Contas a Pagar</h2>
      </div>

      {/* Totalizadores com Ícones */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cardComponent(FaMoneyBill, 'Lançamentos', `${totalPayments}`, 'bg-blue-500')}

        {cardComponent(FaCheckCircle, 'Pago', `${formatCurrency(totalPaid)}`, 'bg-green-500')}

        {cardComponent(FaTimesCircle, ' Em Aberto', `${formatCurrency(totalOpen)}`, 'bg-red-500')}

        {cardComponent(FaWallet, 'Total', `${formatCurrency(totalAmount)}`, 'bg-yellow-500')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <DateRangePicker
          aria-label="Selecionar intervalo de datas"
          value={dateRange}
          onChange={setDateRange}
        />
        <Dropdown aria-label="Selecionar status do pagamento">
          <DropdownTrigger>
            <Button variant="bordered">STATUS DE PAGAMENTO</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Seleção de status"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedStatus}
            onSelectionChange={(keys) => { setSelectedStatus(Array.from(keys).join('')) }}
          >
            <DropdownItem key="Todos">Todos</DropdownItem>
            <DropdownItem key="Aberto">Aberto</DropdownItem>
            <DropdownItem key="Pago">Pago</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown aria-label="Selecionar Tipo de Pagamento">
          <DropdownTrigger>
            <Button variant="bordered">TIPO DE PAGAMENTO</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Seleção de status"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedPaymentType}
            onSelectionChange={(keys) => { setSelectedPaymentType(Array.from(keys).join('')) }}
          >
            {paymentTypesFilter.map((type) => (
              <DropdownItem key={type}>{type}</DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Button onClick={() => setAddModalOpen(true)} startContent={<FaPlus />} aria-label="Adicionar nova conta a pagar">
          Adicionar Conta a Pagar
        </Button>
      </div>

      <div className="justify-center" style={{
        height: "auto",  // Altura total da viewport
        margin: "0 auto",  // Centraliza o Card horizontalmente
      }} >
        <TableComponent columns={columns} data={filteredPayments} />
      </div>



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
                  <DropdownMenu
                    aria-label="Selecione o tipo de pagamento"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={newPayment.supplierId && suppliers.length ? suppliers.find(s => s.id === newPayment.supplierId)?.name : undefined}  // Usa undefined ao invés de null
                    onSelectionChange={(keys) => setNewPayment({ ...newPayment, supplierId: Number(Array.from(keys).join('')) })}
                  >
                    {filteredSuppliers.map((supplier) => (
                      <DropdownItem textValue={supplier.name} key={supplier.id}>{supplier.name} - {supplier.cnpj}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Spacer y={1} />
                <Input
                  label="Descrição"
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                  fullWidth
                  aria-label="Campo de Descrição"
                />
                <Spacer y={1} />
                <Input
                  label="Valor"
                  type="string"
                  placeholder="0.00"
                  labelPlacement="outside"
                  value={newPayment.amount.toString()}
                  onChange={(e) => setNewPayment({ ...newPayment, amount: formatCurrency(e.target.value) })}
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
                  onChange={(e) => setNewPayment({ ...newPayment, boletoCode: e.target.value })}  // Chama a função de validação
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
                    onSelectionChange={(keys) => { setNewPayment({ ...newPayment, paymentType: Array.from(keys).join('') }) }}
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
                <Button onClick={validateBoleto}>Validar Boleto</Button>
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
                      {suppliers.find(s => s.id === selectedPayment.supplierId)?.name || 'Selecione um Fornecedor'}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Lista de fornecedores"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={suppliers.find(s => s.id === selectedPayment.supplierId)?.name}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys).join(''); // Garantir que selecionamos o valor
                      setSelectedPayment({ ...selectedPayment, supplierId: Number(selectedKey) });
                    }}
                  >
                    {filteredSuppliers.map((supplier) => (
                      <DropdownItem textValue={supplier.name} key={supplier.id}>{supplier.name} - {supplier.cnpj}</DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Spacer y={1} />
                <Input
                  label="Descrição"
                  value={selectedPayment?.description || ''}
                  onChange={(e) => setSelectedPayment({ ...selectedPayment, description: e.target.value })}
                  fullWidth
                  aria-label="Campo de Descrição"
                />
                <Spacer y={1} />
                <Input
                  label="Valor"
                  type="number"
                  placeholder="0.00"
                  labelPlacement="outside"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">$</span>
                    </div>
                  }
                  value={selectedPayment?.amount.toString() || ''}
                  onChange={(e) => setSelectedPayment({ ...selectedPayment, amount: formatCurrency(e.target.value) })}
                  fullWidth
                  aria-label="Campo de valor"
                />
                <Spacer y={1} />

                <Input
                  label="Data de Vencimento"
                  type="date"
                  value={getDate(new Date(selectedPayment.dueDate))}
                  onChange={(e) => setSelectedPayment({ ...selectedPayment, dueDate: getDate(new Date(e.target.value)) })}
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
    </Card>
  );
};

export default PaymentPage;
