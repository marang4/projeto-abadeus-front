import React from 'react';
import { Table as BTable, Form } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const Table = <T extends { id?: number | string }>({
  data,
  columns,
  isLoading = false,
  emptyMessage = "Nenhum registro encontrado.",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: TableProps<T>) => {

  if (isLoading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-5 text-muted bg-light rounded">
        <Search size={24} className="mb-2 opacity-50" />
        <p className="mb-0">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-sm overflow-hidden">
      <div className="table-responsive">
        <BTable hover className="mb-0 align-middle">
          <thead className="bg-light text-muted">
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} style={{ width: col.width }} className={`text-${col.align || 'left'} border-0 py-3`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index}>
                {columns.map((col) => (
                  <td key={`${item.id}-${String(col.key)}`} className={`text-${col.align || 'left'} py-3`}>
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </BTable>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light">
          <span className="text-muted small">Página {currentPage} de {totalPages}</span>
          <div className="btn-group">
            <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === 1} onClick={() => onPageChange?.(currentPage - 1)}>
              Anterior
            </button>
            <button className="btn btn-sm btn-outline-secondary" disabled={currentPage === totalPages} onClick={() => onPageChange?.(currentPage + 1)}>
              Próximo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;