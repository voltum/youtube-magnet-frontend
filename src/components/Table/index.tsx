import React, { ReactElement, useEffect } from 'react'
import { Column, useTable } from 'react-table';
import { JsxFragment } from 'typescript';
import Card from '../Card'

interface Props{
    data: Array<any>,
    columns: Array<Column>,
    renderOptions?: {
        (key: string): ReactElement
    }
}

function Table({data: dataSource, columns: columnsSource, renderOptions}: Props) {
    const data = React.useMemo(() => dataSource, [dataSource]);
    const columns = React.useMemo(() => columnsSource, [columnsSource]);
    
   const tableInstance = useTable({ columns, data });
   
   const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    } = tableInstance

    return (
        <table {...getTableProps()} className='table-auto w-full'>
            <thead>
                {
                    headerGroups.map(headerGroup => (
                    
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {
                            headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>
                                    {column.render('Header')}
                                </th>
                            ))
                        }
                    </tr>
                    ))
                }
            </thead>
            <tbody {...getTableBodyProps()}>
            {
                rows.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {
                                row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                            {/* {cell.column.id === 'options' && console.log(cell.row.id)} */}
                                        </td>
                                    )
                                })
                            }
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
    )
}

export default Table
