import React, { useEffect, useCallback, useState } from 'react'
import { Bars, TailSpin } from 'react-loading-icons';
import { Column, useExpanded, useTable } from 'react-table';

interface Props {
    data: Array<any>,
    columns: Array<any>
    isLoading?: boolean
}

function ExpandableTable({ data: dataSource, columns: columnsSource, isLoading }: Props) {
    const data = React.useMemo(() => dataSource, [dataSource]);
    const columns = React.useMemo(() => columnsSource, [columnsSource]);

    const tableInstance = useTable(
        {
            columns,
            data
        }, useExpanded
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { expanded }
    } = tableInstance

    const tableRows = rows;

    return (
        !isLoading ?
            <>
                <div className='relative'>
                    <div className='overflow-x-auto'>
                        <table {...getTableProps()} className='table-fixed border-collapse w-full' style={{ overflowX: 'auto' }}>
                            <thead>
                                {
                                    headerGroups.map(headerGroup => (

                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {
                                                headerGroup.headers.map(column => (
                                                    <th {...column.getHeaderProps([{ style: { width: column.width } }])}>
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
                                    tableRows.map(row => {
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
                    </div>
                </div>
            </>
            :
            <>
                <div className='w-full h-16 flex items-center justify-center'><TailSpin className='w-4 mr-2' speed={1.5} />LOADING...</div>
            </>
    )
}

export default ExpandableTable

export { Indicator } from './Indicator'