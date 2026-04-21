import React from 'react';
import './DataTable.css';

const DataTable = ({ columns, data, renderActions }) => {
  if (!data) {
    return <p>Không có dữ liệu để hiển thị.</p>;
  }

  // Helper function to get nested property like 'specialty.name'
  const getCellValue = (row, accessor) => {
    return accessor.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined' ? obj[key] : ''), row);
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
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.accessor}>{getCellValue(row, col.accessor)}</td>
                ))}
                {renderActions && <td className="actions-cell">{renderActions(row)}</td>}
              </tr>
            ))
          ) : (
            <tr><td colSpan={columns.length + (renderActions ? 1 : 0)} className="no-data">Không tìm thấy dữ liệu.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;