import React, { useState } from "react";

import { Button, Icon } from "@components/atoms";

interface TableEditorProps {
  headers: string[];
  rows: string[][];
  onSave: (headers: string[], rows: string[][]) => void;
  onCancel: () => void;
}

export const TableEditor: React.FC<TableEditorProps> = ({
  headers: initialHeaders,
  rows: initialRows,
  onSave,
  onCancel,
}) => {
  const [headers, setHeaders] = useState<string[]>(initialHeaders);
  const [rows, setRows] = useState<string[][]>(initialRows);

  const handleHeaderChange = (index: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index] = value;
    setHeaders(newHeaders);
  };

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };

  const handleAddRow = () => {
    const newRow = new Array(headers.length).fill("");
    setRows([...rows, newRow]);
  };

  const handleDeleteRow = (rowIndex: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, index) => index !== rowIndex));
    }
  };

  const handleAddColumn = () => {
    setHeaders([...headers, `Column ${headers.length + 1}`]);
    setRows(rows.map((row) => [...row, ""]));
  };

  const handleDeleteColumn = (colIndex: number) => {
    if (headers.length > 1) {
      setHeaders(headers.filter((_, index) => index !== colIndex));
      setRows(rows.map((row) => row.filter((_, index) => index !== colIndex)));
    }
  };

  const handleSave = () => {
    onSave(headers, rows);
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-gray-300 bg-blue-50/30">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-blue-100/50">
            <tr>
              {headers.map((header, colIndex) => (
                <th
                  key={colIndex}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) =>
                        handleHeaderChange(colIndex, e.target.value)
                      }
                      className="flex-1 px-2 py-1 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Header"
                    />
                    {headers.length > 1 && (
                      <button
                        onClick={() => handleDeleteColumn(colIndex)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                        title="Delete column"
                      >
                        <Icon name="trash" size="xs" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 w-16">
                <button
                  onClick={handleAddColumn}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                  title="Add column"
                >
                  <Icon name="plus" size="sm" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-blue-50/20 transition-colors">
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                  >
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      className="w-full px-2 py-1 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Cell value"
                    />
                  </td>
                ))}
                <td className="px-6 py-4 w-16">
                  <button
                    onClick={() => handleDeleteRow(rowIndex)}
                    className="text-red-600 hover:text-red-800 p-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete row"
                    disabled={rows.length === 1}
                  >
                    <Icon name="trash" size="xs" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="secondary" size="sm" onClick={handleAddRow}>
          <Icon name="plus" size="sm" className="mr-1" />
          Add Row
        </Button>

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Icon name="save" size="sm" className="mr-1" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
