import { ArrowRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { matchSorter } from 'match-sorter';
import React, { useEffect, useCallback, useState } from 'react'
import { Bars, TailSpin } from 'react-loading-icons';
import { Column, useGlobalFilter, useTable, Row, IdType, useSortBy, usePagination } from 'react-table';

interface Props{
    data: Array<any>,
    columns: Array<Column>,
    pagination?: {
        defaultPageSize: number
    },
    filter?: {
        search?: {
            filters: string[]
        }
    },
    isLoading?: boolean
}

function Table({data: dataSource, columns: columnsSource, pagination, filter, isLoading}: Props) {
    const data = React.useMemo(() => dataSource, [dataSource]);
    const columns = React.useMemo(() => columnsSource, [columnsSource]);


    const globalFilterFunction = useCallback(
        (rows: Row<Object>[], ids: IdType<any>[], query: string) => {
            
            return matchSorter(rows, query, {
                keys: filter?.search?.filters?.map((columnName) => `values.${columnName}`)
            });
        },
        [filter?.search?.filters]
    );
    
   const tableInstance = useTable({ columns, data, initialState: { pageSize: pagination?.defaultPageSize }, globalFilter: globalFilterFunction }, useGlobalFilter, useSortBy, usePagination);
   
   const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        rows,
        prepareRow,
        setGlobalFilter,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = tableInstance

    const tableRows = pagination ? page : rows;

    const [filtertext, setFilter] = useState<string>("");

    useEffect(() => {
        setGlobalFilter(filtertext || undefined) // Set the Global Filter to the filter prop.
    }, [filtertext, setGlobalFilter]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.currentTarget;
        setFilter(value);
    };

    return (
        !isLoading ?
        <>
        {filter?.search? 
            <input
                value={filtertext}
                onChange={handleInputChange}
                placeholder={`Filter by ${filter.search.filters.join('/')}`}
                type={'text'}
                autoComplete='autocomplete_off_tablesearch'
            />
            : null
        }
        <table {...getTableProps()} className='table-auto w-full'>
            <thead>
                {
                    headerGroups.map(headerGroup => (
                    
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {
                            headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                        ? column.isSortedDesc
                                            ? ' 🔽'
                                            : ' 🔼'
                                        : ''}
                                    </span>
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

        {pagination?
            <div className="pagination flex justify-between mt-4 text-sm">
                <div>
                    <span>
                        Page <strong> {pageIndex + 1} of {pageOptions.length}.</strong> Total <strong>{data.length}</strong> channels. {' '}
                    </span>
                    {data.length > pageSize ? 
                        <>
                            <span>
                                | Go to page:
                            <input
                                type="number"
                                defaultValue={pageIndex + 1}
                                onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                gotoPage(page)
                                }}
                                style={{ width: '70px', margin: '0 10px' }}
                            />
                            </span>
                            <select
                                value={pageSize}
                                onChange={e => {
                                    setPageSize(Number(e.target.value))
                                }}
                            >
                                {[30, 50, 100, 200, 500].map(pageSize => (
                                    <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                    </option>
                                ))}
                            </select>
                        </>
                        :
                        <></>
                    }
                </div>
                <div className='flex gap-2'>
                    <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        <ChevronDoubleLeftIcon className='w-6' />
                    </button>
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        <ChevronLeftIcon className='w-6' />
                    </button>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        <ChevronRightIcon className='w-6' />
                    </button>
                    <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        <ChevronDoubleRightIcon className='w-6' />
                    </button>
                </div>
            </div>
            :
            null
        }
        </>
        :
        <>
            <div className='w-full h-16 flex items-center justify-center'><TailSpin className='w-4 mr-2' speed={1.5} />LOADING...</div>
        </>
    )
}

export default Table

export { Indicator } from './Indicator'