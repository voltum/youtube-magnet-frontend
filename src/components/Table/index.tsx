import { ArrowRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { ControlledMenu, MenuItem, SubMenu, useMenuState } from '@szhsin/react-menu';
import { matchSorter } from 'match-sorter';
import React, { useEffect, useCallback, useState } from 'react'
import { Bars, TailSpin } from 'react-loading-icons';
import { Column, useGlobalFilter, useTable, Row, IdType, useSortBy, usePagination, FilterProps, useFilters } from 'react-table';
import '@szhsin/react-menu/dist/index.css';
import "@szhsin/react-menu/dist/theme-dark.css";
import '@szhsin/react-menu/dist/transitions/slide.css';
import ContextMenu from '../ContextMenu';
import { Channel } from '../../utils/channels';

interface Props {
    data: Array<any>,
    columns: Array<Column>,
    folders?: Array<object>,
    pagination?: {
        defaultPageSize: number
    },
    filter?: {
        search?: {
            filters: string[]
        }
        between?: any
    },
    isLoading?: boolean
}

export function NumberRangeColumnFilter({
    column: { filterValue = [], render, preFilteredRows, setFilter, id },
}: FilterProps<any>) {
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '5px',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    paddingTop: 5,
                }}
            >
                <input
                    id={`${id}_1`}
                    value={filterValue[0] || ''}
                    type='number'
                    onChange={(e) => {
                        const val = e.target.value
                        setFilter((old: any[] = []) => [val ? parseInt(val, 10) : undefined, old[1]])
                    }}
                    placeholder={`From`}
                    style={{
                        minWidth: '80px',
                        maxWidth: '100px'
                    }}
                />
                <input
                    id={`${id}_2`}
                    value={filterValue[1] || ''}
                    type='number'
                    onChange={(e) => {
                        const val = e.target.value
                        setFilter((old: any[] = []) => [old[0], val ? parseInt(val, 10) : undefined])
                    }}
                    placeholder={`To`}
                    style={{
                        minWidth: '80px',
                        maxWidth: '100px'
                    }}
                />
            </div>
        </>
    )
}

export function SelectColumnFilter({
    column: { filterValue, render, preFilteredRows, setFilter, id },
}: FilterProps<any>) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...Array.from(options.values())]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
        <select
            value={filterValue || "s"}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option ? 'true' : 'false'}>
                    {option ? 'Exists' : 'Not exists'}
                </option>
            ))}
        </select>
    )
}

export function SelectColumnFilterGeneral({
    column: { filterValue, render, preFilteredRows, setFilter, id },
}: FilterProps<any>) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...Array.from(options.values())]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
        <select
            value={filterValue || "s"}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => {
                if (typeof option === 'string')
                    return <option key={i} value={option}>
                        {option}
                    </option>
            })}
        </select>
    )
}

function Table({ data: dataSource, columns: columnsSource, folders, pagination, filter, isLoading }: Props) {
    const data = React.useMemo(() => dataSource, [dataSource]);
    const columns = React.useMemo(() => columnsSource, [columnsSource]);

    const [menuProps, toggleMenu] = useMenuState();
    const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
    const [contextDetails, setContextDetails] = useState<Channel | null | undefined>(null);

    const globalFilterFunction = useCallback(
        (rows: Row<Object>[], ids: IdType<any>[], query: string) => {

            return matchSorter(rows, query, {
                keys: filter?.search?.filters?.map((columnName) => `values.${columnName}`)
            });
        },
        [filter?.search?.filters]
    );

    const tableInstance = useTable({ columns, data, initialState: { pageSize: pagination?.defaultPageSize }, globalFilter: globalFilterFunction }, useGlobalFilter, useFilters, useSortBy, usePagination);

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
                {filter?.search ?
                    <input
                        value={filtertext}
                        onChange={handleInputChange}
                        placeholder={`Filter by ${filter.search.filters.join('/')}`}
                        type={'text'}
                        autoComplete='autocomplete_off_tablesearch'
                    />
                    : null
                }
                <div className='relative'>
                    <div className='overflow-x-auto'>
                        <table {...getTableProps()} className='table-fixed border-collapse w-full' style={{ overflowX: 'auto' }}>
                            <thead>
                                {
                                    headerGroups.map(headerGroup => (

                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {
                                                headerGroup.headers.map(column => (
                                                    <th {...column.getHeaderProps([{ style: { width: column.width } }, column.getSortByToggleProps()])}>
                                                        {column.render('Header')}
                                                        <span>
                                                            {column.isSorted
                                                                ? column.isSortedDesc
                                                                    ? ' 🔽'
                                                                    : ' 🔼'
                                                                : ''}
                                                        </span>
                                                        <div onClick={(e) => e.stopPropagation()}>{column.canFilter && column.Filter ? column.render('Filter') : null}</div>
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
                                            <tr {...row.getRowProps()} onContextMenu={e => {
                                                e.preventDefault();
                                                setAnchorPoint({ x: e.clientX, y: e.clientY });
                                                setContextDetails(row.original as Channel);
                                                toggleMenu(true);
                                            }}>
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

                <ContextMenu items={folders} menuProps={menuProps} toggleMenu={toggleMenu} anchorPoint={anchorPoint} details={contextDetails} />

                {pagination ?
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