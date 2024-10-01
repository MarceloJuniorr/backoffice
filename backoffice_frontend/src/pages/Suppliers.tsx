import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, Spacer, Tooltip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { EditIcon, DeleteIcon, EyeIcon, PlusIcon } from '../components/Icons'; // Assumindo que os ícones estão em uma pasta "Icons"
import useAxios from '../api';
import { useDisclosure } from '@nextui-org/react';

// Definir o tipo para os fornecedores
interface Supplier {
  id: number;
  name: string;
  cnpj: string;
  address: string;
}

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState('');
  const [newSupplier, setNewSupplier] = useState<Supplier>({
    id: 0,
    name: '',
    cnpj: '',
    address: ''
  });
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null); // Para o fornecedor em edição
  const { isOpen: isAddModalOpen, onOpen: openAddModal, onOpenChange: onAddModalOpenChange } = useDisclosure(); // Modal de adicionar fornecedor
  const { isOpen: isEditModalOpen, onOpen: openEditModal, onOpenChange: onEditModalOpenChange } = useDisclosure(); // Modal de editar fornecedor
  const api = useAxios();

  // Função para buscar os fornecedores da API, memoizada com useCallback
  const fetchSuppliers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/suppliers', {
        headers: { authorization: token },
      });
      setSuppliers(response.data);
    } catch (error) {
      console.error('Erro ao buscar fornecedores', error);
    }
  }, [api]);

  // Função para adicionar um novo fornecedor
  const handleAddSupplier = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/suppliers',
        newSupplier,
        { headers: { authorization: token } }
      );
      alert('Fornecedor adicionado!');
      fetchSuppliers();  // Atualiza a lista de fornecedores
      setNewSupplier({ id: 0, name: '', cnpj: '', address: '' }); // Limpa o formulário
      onAddModalOpenChange(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao adicionar fornecedor', error);
    }
  };

  // Função para editar um fornecedor existente
  const handleEditSupplier = async () => {
    if (!editingSupplier) return;
    try {
      const token = localStorage.getItem('token');
      await api.put(
        `/suppliers/${editingSupplier.id}`,
        editingSupplier,
        { headers: { authorization: token } }
      );
      alert('Fornecedor atualizado!');
      fetchSuppliers();  // Atualiza a lista de fornecedores
      onEditModalOpenChange(); // Fecha o modal de edição
    } catch (error) {
      console.error('Erro ao atualizar fornecedor', error);
    }
  };

  // Chama a função para buscar fornecedores ao carregar a página
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Função para renderizar as células da tabela
  const renderCell = (supplier: Supplier, columnKey: React.Key) => {
    const cellValue = supplier[columnKey as keyof Supplier];

    switch (columnKey) {
      case "name":
        return <>{supplier.name}</>;
      case "cnpj":
        return <>{supplier.cnpj}</>;
      case "address":
        return <>{supplier.address}</>;
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Visualizar">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Editar fornecedor">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => {
                  setEditingSupplier(supplier); // Define o fornecedor atual para edição
                  openEditModal(); // Abre o modal de edição
                }}
              >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Excluir fornecedor">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const columns = [
    { name: "Nome", uid: "name" },
    { name: "CNPJ", uid: "cnpj" },
    { name: "Endereço", uid: "address" },
    { name: "Ações", uid: "actions" },
  ];

  return (
    <Card style={{ maxWidth: '800px', padding: '20px', margin: 'auto', marginTop: '50px' }}>
      <h2>Gerenciar Fornecedores</h2>
      <Spacer y={1} />
      <Input
        isClearable
        placeholder="Buscar Fornecedor"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />
      <Spacer y={1} />
      <Button
        startContent={<PlusIcon />} // Adiciona o ícone antes do texto
        onPress={openAddModal} // Abre o modal de adicionar fornecedor
      >
        Adicionar Fornecedor
      </Button>
      <Spacer y={2} />
      <Table
        aria-label="Tabela de Fornecedores"
        style={{ height: 'auto', minWidth: '100%' }}
        selectionMode="single"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={suppliers.filter((supplier) => supplier.name.toLowerCase().includes(search.toLowerCase()))}>
          {(supplier) => (
            <TableRow key={supplier.id}>
              {(columnKey) => <TableCell>{renderCell(supplier, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal para Adicionar Fornecedor */}
      <Modal isOpen={isAddModalOpen} onOpenChange={onAddModalOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Adicionar Fornecedor</ModalHeader>
              <ModalBody>
                <Input
                  label="Nome do Fornecedor"
                  placeholder="Nome"
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  fullWidth
                />
                <Spacer y={1} />
                <Input
                  label="CNPJ"
                  placeholder="CNPJ"
                  value={newSupplier.cnpj}
                  onChange={(e) => setNewSupplier({ ...newSupplier, cnpj: e.target.value })}
                  fullWidth
                />
                <Spacer y={1} />
                <Input
                  label="Endereço"
                  placeholder="Endereço"
                  value={newSupplier.address}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                  fullWidth
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>Fechar</Button>
                <Button color="primary" onPress={handleAddSupplier}>Adicionar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Modal para Editar Fornecedor */}
      <Modal isOpen={isEditModalOpen} onOpenChange={onEditModalOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Editar Fornecedor</ModalHeader>
              <ModalBody>
                <Input
                  label="Nome do Fornecedor"
                  placeholder="Nome"
                  value={editingSupplier?.name || ''}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier!, name: e.target.value })}
                  fullWidth
                />
                <Spacer y={1} />
                <Input
                  label="CNPJ"
                  placeholder="CNPJ"
                  value={editingSupplier?.cnpj || ''}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier!, cnpj: e.target.value })}
                  fullWidth
                />
                <Spacer y={1} />
                <Input
                  label="Endereço"
                  placeholder="Endereço"
                  value={editingSupplier?.address || ''}
                  onChange={(e) => setEditingSupplier({ ...editingSupplier!, address: e.target.value })}
                  fullWidth
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>Fechar</Button>
                <Button color="primary" onPress={handleEditSupplier}>Salvar</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default Suppliers;
