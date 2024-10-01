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
} from "@nextui-org/react";

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
interface TableComponentProps {
  columns: Array<{ uid: string; name: string; sortable?: boolean; hiddenOnMobile?: boolean }>;
  data: Array<Record<string, any>>;
}

const TableComponent: React.FC<TableComponentProps> = ({ columns, data }) => {
  // Função que renderiza cada célula com base na chave da coluna
  const renderCell = React.useCallback(
    (item: Record<string, any>, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof typeof item];

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
    []
  );

  return (
    <Table aria-label="Reusable table component">
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
      <TableBody items={data}>
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
