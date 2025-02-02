import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@nextui-org/react';
import useAxios from '../api';
import moment from 'moment'; // Certifique-se de ter o moment instalado: npm install moment
import { DateRangePicker, RangeValue, DateValue } from '@nextui-org/react';
import { parseDate } from '@internationalized/date'; // Importe formatDate
import TableComponent from '../components/Table';

interface Log {
  id: number;
  endpoint: string;
  type: string;
  idparams: string | null;
  body: string | null;
  user: string | null;
  createdAt: string;
}

const columns = [
  { uid: "id", name: "ID", sortable: true },
  { uid: "endpoint", name: "Endpoint", sortable: true },
  { uid: "type", name: "Tipo", sortable: true },
  { uid: "idparams", name: "ID Busca", sortable: true },
  { uid: "body", name: "Detalhes", sortable: true },
  { uid: "user", name: "Usuário", sortable: true },
  { uid: "createdAt", name: "DateTime", sortable: true },
];

const LogPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [dateRange, setDateRange] = useState<RangeValue<DateValue>>({
    start: parseDate(moment().format('YYYY-MM-DD')), // Use moment para data inicial
    end: parseDate(moment().add(7, 'days').format('YYYY-MM-DD')), // Use moment para data final
  });


  const api = useAxios();

  const fetchLogs = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/logs', {
        headers: { authorization: token },
      });
      const logData = response.data;
      setLogs(logData);
      setFilteredLogs(logData);
    } catch (error) {
      console.error('Erro ao buscar Logs', error);
    }
  }, [api]);
  
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (dateRange.start && dateRange.end) {
      const filtered = logs.filter(log => {
        const logDate = parseDate(log.createdAt);
        return logDate >= dateRange.start && logDate <= dateRange.end;
      });
      setFilteredLogs(filtered);
    } else {
      setFilteredLogs(logs);
    }
  }, [dateRange, logs]);

  return (
    <Card style={{ maxWidth: '1150px', padding: '15px', margin: 'auto', marginTop: '25px' }}>
      <div className="flex justify-center items-center mb-4">
        <h2 className="text-3xl font-bold">Contas a Pagar</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <DateRangePicker
          aria-label="Selecionar intervalo de datas"
          value={dateRange}
          onChange={setDateRange}
        />
      </div>

      <div className="justify-center" style={{
        height: "auto",
        margin: "0 auto",
      }} >
        <TableComponent columns={columns} data={filteredLogs} />
      </div>

    </Card>
  );
};

export default LogPage;