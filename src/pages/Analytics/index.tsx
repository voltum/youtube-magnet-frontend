import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Column } from 'react-table';
import Card from '../../components/Card';
import Table, { Indicator } from '../../components/Table';
import { AppConfig } from '../../utils/config';

function Analytics() {

    const [logsList, setLogsList] = useState([]);
    // Const declarations
    const host = window.location.hostname;
    const protocol = window.location.protocol;

    useEffect(() => {
        getLogs();
    }, []);

    const getLogs = () => {
        return axios.get(AppConfig.getLogsURL())
            .then((response) => {
                setLogsList(response.data);
            })
            .catch((error) => {
                console.log('Folders', error)
                toast.error(error);
            })
    }

    const columns: Array<Column<{}>> = [
        {
            Header: '#',
            accessor: 'index',
            Cell: (props: any) => <>{Number(props.row.id) + 1}</>,
            width: 50
        },
        // {
        //     Header: '⦀',
        //     accessor: 'chunkStamp',
        //     Cell: (props: any) => <></>,
        //     width: 40
        // },
        {
            Header: 'Text',
            accessor: 'text',
            Cell: (props: any) => <> {props.value} </>,
            width: 150,
        },
        {
            Header: 'URL',
            accessor: 'url',
            Cell: (props: any) => <a href={props.value} target={'_blank'}>{props.value}</a>,
            width: 150,
        },
        {
            Header: 'Folder',
            accessor: 'folder',
            Cell: (props: any) => <>{props.value}</>,
            width: 150,
        },
        {
            Header: 'Date',
            accessor: 'createdAt',
            Cell: (props: any) => <>{moment(props.value).fromNow()}</>,
            width: 150,
        }
    ];
  return (
    <>
        <h1>Error log</h1>
        <br/>
        <Card>
            <Table data={logsList} columns={columns} />
        </Card>
    </>
  );
}

export default Analytics;
