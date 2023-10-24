/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React from 'react';
import { useTable } from 'react-table';
import EditableCell from './EditableCell';
import '../../../styles/Param.scss';

// Set editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

/**
 * Table component
 */
function Table({
  columns,
  data,
  updateData,
  algo,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
  } = useTable({
    columns,
    data,
    defaultColumn,
    updateData,
    algo,
  }); 


  // add the header in left side of table
  let counter = 0;
  const incrementCounter = () => { counter += 1; };
  // Render the table
  return (
    <div className="table">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              <th>Node</th>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                <th {...incrementCounter()}>{counter}</th>
                {row.cells.map((cell) => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ); 

  
}

export default Table;
