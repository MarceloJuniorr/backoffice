import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { FaBars, FaTimes } from "react-icons/fa"; // Ícones de menu
import "./Sidebar.css"; // Adicione estilos customizados se necessário

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar visibilidade da sidebar
  const navigate = useNavigate();

  // Função para deslogar
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remover o token do localStorage
    navigate('/'); // Redirecionar para a página de login
  };

  // Função para alternar a visibilidade da sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Alterna entre abrir e fechar a sidebar
  };

  return (
    <>
      {/* Botão do menu hambúrguer */}
      <div className="fixed top-2 left-2 z-50" style={{backgroundColor: "gray", borderRadius: 10 }} >
        <button onClick={toggleSidebar} className="text-2xl p-1">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-4 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/users" className="hover:bg-gray-700 p-2 rounded">
            Usuários
          </Link>
          <Link to="/suppliers" className="hover:bg-gray-700 p-2 rounded">
            Fornecedores
          </Link>
          <Link to="/payments" className="hover:bg-gray-700 p-2 rounded">
            Contas a Pagar
          </Link>
          <Button
            className="bg-red-500 hover:bg-red-600 mt-6 w-full text-white"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </nav>
      </aside>

      {/* Overlay para quando a sidebar estiver aberta */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-40"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
