import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Suppliers from "./pages/Suppliers";
import PaymentPage from "./pages/PaymentPage";
import Tests from "./pages/Test";

import Sidebar from "./components/Sidebar";
import "./styles/globals.css";
import LogPage from "./pages/LogPage";

// Componente Layout que decide quando renderizar a Sidebar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  // Condicional para exibir a Sidebar em todas as páginas, exceto na página de login
  const isLoginPage = location.pathname === "/";

  return (
    <div className="flex">
      {!isLoginPage && <Sidebar />} {/* Sidebar não será renderizada na página de login */}
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
};



const App = () => {


  return (
    <NextUIProvider>
      <Router>
        <div className="flex">
          <div className="flex-1 p-4">
            <Layout>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/users" element={<Users />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/payments" element={<PaymentPage />} />
                <Route path="/logs" element={<LogPage />} />
                <Route path="/tests" element={<Tests />}></Route>
              </Routes>
            </Layout>
          </div>

        </div>
      </Router>
    </NextUIProvider>
  );
};

export default App;
