"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const supplierRoutes_1 = __importDefault(require("./routes/supplierRoutes"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.default);
app.use('/payments', paymentRoutes_1.default);
app.use('/suppliers', supplierRoutes_1.default);
app.use('/users', usersRoutes_1.default);
app.get('/', (req, res) => res.send('API funcionando!'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
