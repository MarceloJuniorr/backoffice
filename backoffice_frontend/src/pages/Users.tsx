import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Card, Spacer, Tooltip } from '@nextui-org/react';
import { EditIcon, DeleteIcon, EyeIcon } from '../components/Icons'; // Assumindo que os ícones estão em uma pasta "Icons"
import useAxios from '../api';  // O arquivo onde você configura o axios para fazer as chamadas HTTP

// Definir o tipo para os usuários
interface User {
  id: number;
  username: string;
  email: string;
}

const Users = () => {
  // Tipar o estado de users
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
  });
  const api = useAxios()

  // Função para buscar os usuários da API
  const fetchUsers = useCallback( async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/users', {
        headers: { authorization: token },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
    }
  },[api]);

  // Função para adicionar um novo usuário
  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post(
        '/users',
        newUser,
        { headers: { authorization: token } }
      );
      alert('Usuário adicionado!');
      fetchUsers();  // Atualiza a lista de usuários
      setNewUser({ username: '', email: '' }); // Limpa o formulário
    } catch (error) {
      console.error('Erro ao adicionar usuário', error);
    }
  };

  // Chama a função para buscar usuários ao carregar a página
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Função para renderizar as células da tabela
  const renderCell = (user: User, columnKey: React.Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "username":
        return <>{user.username}</>;
      case "email":
        return <>{user.email}</>;
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Visualizar">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Editar usuário">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Excluir usuário">
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
    { name: "Usuário", uid: "username" },
    { name: "Email", uid: "email" },
    { name: "Ações", uid: "actions" },
  ];

  return (
    <Card style={{ maxWidth: '800px', padding: '20px', margin: 'auto', marginTop: '50px' }}>
      <h2>Gerenciar Usuários</h2>
      <Spacer y={1} />
      <Input
        isClearable
        placeholder="Buscar Usuário"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />
      <Spacer y={1} />
      <Input
        isClearable
        placeholder="Nome do Usuário"
        value={newUser.username}
        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        fullWidth
      />
      <Spacer y={1} />
      <Input
        isClearable
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        fullWidth
      />
      <Spacer y={1} />
      <Button onClick={handleAddUser} color="primary">
        Adicionar Usuário
      </Button>
      <Spacer y={2} />
      <Table
        aria-label="Tabela de Usuários"
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
        <TableBody items={users.filter((user) => user.username.toLowerCase().includes(search.toLowerCase()))}>
          {(user) => (
            <TableRow key={user.id}>
              {(columnKey) => <TableCell>{renderCell(user, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default Users;
