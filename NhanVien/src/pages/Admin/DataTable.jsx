import React from 'react';

/**
 * DataTable
 * @param {Array}    columns        - [{ header, accessor, cell? }]
 * @param {Array}    data           - array of row objects
 * @param {Function} renderActions  - (row) => JSX for action buttons
 */
const DataTable = ({ columns = [], data = [], renderActions }) => {
  const renderCell = (row, col) => {
    if (col.cell) return col.cell(row);
    // Support dot-notation accessor, e.g. "specialty.name"
    return col.accessor.split('.').reduce((obj, key) => obj?.[key], row) ?? '—';
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
            {renderActions && <th>Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                style={{ textAlign: 'center', color: '#9ca3af', padding: '32px 16px' }}
              >
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map((col) => (
                  <td key={col.accessor}>{renderCell(row, col)}</td>
                ))}
                {renderActions && (
                  <td className="actions-cell">{renderActions(row)}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
