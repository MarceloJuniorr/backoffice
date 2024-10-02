import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { pool } from '../config/db';
import authRoutes from './routes/authRoutes';
import paymentRoutes from './routes/paymentRoutes';
import supplierRoutes from './routes/supplierRoutes';
import usersRoutes from './routes/usersRoutes';
import dotenv from 'dotenv';

dotenv.config();


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/payments', paymentRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/users', usersRoutes);


app.get('/', (req, res) => res.send('API funcionando!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
