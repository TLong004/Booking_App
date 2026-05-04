import React from 'react';

/**
 * DataTable
 * @param {Array}    columns       - [{ header, accessor, width?, cell? }]
 * @param {Array}    data          - array of row objects
 * @param {Function} renderActions - (row) => JSX — action buttons per row
 */
const DataTable = ({ columns = [], data = [], renderActions }) => {
  const getCell = (row, col) => {
    if (col.cell) return col.cell(row);
    // Support dot-notation: "specialty.name"
    return col.accessor.split('.').reduce((obj, key) => obj?.[key], row) ?? '—';
  };

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.accessor} style={col.width ? { width: col.width } : {}}>
                {col.header}
              </th>
            ))}
            {renderActions && <th style={{ width: '14%' }}>Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                className="empty-cell"
              >
                Không có dữ liệu phù hợp
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map(col => (
                  <td key={col.accessor}>{getCell(row, col)}</td>
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
