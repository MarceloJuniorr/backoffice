import TableComponent from "../components/Table";
import { EditIcon, DeleteIcon } from "../components/Icons";
import useAxios from "../api";
import { useCallback, useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";

interface Payment {
  id: number;
  supplierId: string;
  amount: number;
  dueDate: string;
  status: string;
  boletoCode: string;
  paymentDate: string;
}

interface DataItem {
  amount: number;
  boletoCode: string;
  description: string;
  dueDate: string;
  id: number;
  paymentDate: string;
  paymentType: string;
  status: string;
  store: string;
  supplierId: number;
}

// Definindo as colunas da tabela
//const columns = [
//  { uid: "name", name: "Nome" },
//  { uid: "role", name: "Cargo" },
//  { uid: "status", name: "Status" },
//  { uid: "actions", name: "Ações" },
//];

const columns = [
  { uid: "id", name: "ID", sortable: true },
  { uid: "description", name: "Descrição", sortable: true, hiddenOnMobile: true },
  { uid: "amount", name: "Valor", sortable: true },
//  { uid: "boletoCode", name: "Código do Boleto", sortable: true, hiddenOnMobile: true },
  { uid: "dueDate", name: "Data de Vencimento", sortable: true },
  { uid: "paymentDate", name: "Data de Pagamento", sortable: true, hiddenOnMobile: true },
  { uid: "paymentType", name: "Tipo de Pagamento", sortable: true, hiddenOnMobile: true }, // Esconder em mobile
  { uid: "status", name: "Status", sortable: true },
  { uid: "store", name: "Loja", sortable: true, hiddenOnMobile: true }, // Esconder em mobile
  { uid: "supplierId", name: "ID do Fornecedor", sortable: true, hiddenOnMobile: true },
  { uid: "actions", name: "Ações" },
];
export default function App() {
  const [payments, setPayments] = useState<Payment[]>([]);

  
const copyBoletoCode = (code: string) => {
  navigator.clipboard.writeText(code);
  alert('Código do boleto copiado!');
};
  
  
  const api = useAxios();

  // Função para buscar as contas a pagar da API
  const fetchPayments = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/payments', {
        headers: { authorization: token },
      });
      const updatedData = response.data.map((item: DataItem ) => ({
        ...item,
        actions: [
          {
            icon: <FaCopy />,
            tooltip: "Copiar Boleto",
            onClick: () => copyBoletoCode(item.boletoCode),
          },
          {
            icon: <EditIcon />,
            tooltip: "Editar",
            onClick: () => console.log(`Editar item ${item.id}`),
          },
          {
            icon: <DeleteIcon />,
            tooltip: "Excluir",
            onClick: () => console.log(`Excluir item ${item.id}`),
          },
        ],
      }));
      setPayments(updatedData);
    } catch (error) {
      console.error('Erro ao buscar pagamentos', error);
    }
  }, [api]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);
  console.log(payments);
  
  return (
  <div className="justify-center" style={{
    height: "100vh",  // Altura total da viewport
    margin: "0 auto",  // Centraliza o Card horizontalmente
  }} >
    <TableComponent columns={columns} data={payments} />
  </div>
  )
    
}
