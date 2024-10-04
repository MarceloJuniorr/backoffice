import React, { useState } from "react";
import { Input, Button, Card, Spacer } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';

import useAxios from "../api";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isVisible = false
  const navigate = useNavigate();
  const api = useAxios()




  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { username, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      navigate('/Payments');
    } catch (error) {
      console.error("Erro de login", error);
      alert("Falha no login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-center text-danger font-bold text-xl">
          RECONIZE
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
          Backoffice Digital
        </p>

        <Spacer y={1.5} />
        <Input
          key="danger"
          isRequired
          fullWidth
          color="danger"
          size="lg"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Spacer y={1.5} />
        <Input
          fullWidth
          color="danger"
          size="lg"
          type={isVisible ? "text" : "password"}
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Spacer y={1.5} />
        <Button
          className="w-full"
          onClick={handleLogin}
          onPress={handleLogin}

          color="danger"
          size="lg"
          variant="solid"
        >
          Entrar
        </Button>
        <Spacer y={0.5} />
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Esqueceu sua senha?{" "}
          <span className="text-primary font-bold cursor-pointer">
            Clique aqui
          </span>
        </p>
      </Card>
    </div>
  );
};

export default Login;