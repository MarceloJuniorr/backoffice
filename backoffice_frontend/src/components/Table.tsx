import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User as NextUser,
  Chip,
  Tooltip,
  ChipProps,
  SortDescriptor,
} from "@nextui-org/react";

// Função para converter a data para o formato DD/MM/YYYY
const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};



// Definindo o mapeamento das cores de status
const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
  Pago: "success",
  Aberto: "warning",
  Vencido: "danger",
};

// Tipos para as props da tabela
interface Columns {
  uid: string;
  name: string;
  sortable?: boolean;
  hiddenOnMobile?: boolean;
  isDate?: boolean; // Novo campo para indicar que a coluna é uma data
}
interface TableComponentProps {
  columns:Columns[] ;
  data: Array<Record<string, any>>;
}


const TableComponent: React.FC<TableComponentProps> = ({ columns, data }) => {
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age", // Defina uma coluna inicial
    direction: "ascending", // Defina a direção inicial
  });

  const handleSortChange = (descriptor: SortDescriptor) => {
    setSortDescriptor(descriptor);
  };

  const sortedItems = React.useMemo(() => {
    return [...data].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];
  
      let cmp = 0; // Iniciamos cmp como 0
  
      if (typeof first === "string" && typeof second === "string") {
        cmp = first.localeCompare(second); // Para strings
      } else if (typeof first === "number" && typeof second === "number") {
        cmp = first - second; // Para números
      }
  
      // Se direction for "descending", invertemos a comparação
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, data]);
  
  
  // Função que renderiza cada célula com base na chave da coluna
  const renderCell = React.useCallback(
    (item: Record<string, any>, columnKey: React.Key) => {
      const column = columns.find((col) => col.uid === columnKey);
      const cellValue = item[columnKey as keyof typeof item];

      // Verifica se a coluna é do tipo data
      if (column?.isDate && cellValue) {
        return formatDate(cellValue);
      }

      switch (columnKey) {
        case "name":
          return (
            <NextUser
              avatarProps={{ radius: "lg", src: item.avatar }}
              description={item.email}
              name={cellValue}
            >
              {item.email}
            </NextUser>
          );
        case "status":
          return (
            <Chip className="capitalize" color={statusColorMap[item.status]} size="sm" variant="flat">
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2 justify-center">
              {item.actions?.map((action: any, index: number) => (
                <Tooltip key={index} content={action.tooltip}>
                  <span
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={action.onClick}
                  >
                    {action.icon}
                  </span>
                </Tooltip>
              ))}
            </div>
          );
        default:
          return cellValue;
      }
    },
    [columns]
  );

  return (
    <Table aria-label="Reusable table component"
    sortDescriptor={sortDescriptor}
    onSortChange={handleSortChange}>
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            className={`${
              column.hiddenOnMobile ? "hidden md:table-cell" : "" // Esconde a coluna em telas pequenas
            }`}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell
                className={`${
                  columns.find((col) => col.uid === columnKey)?.hiddenOnMobile
                    ? "hidden md:table-cell"
                    : ""
                }`}
              >
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TableComponent;
