import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Column } from 'react-table';
import Card from '../../components/Card'
import Table from '../../components/Table';
import { AppConfig } from '../../utils/config';

const data: Array<object> = [
    {
        col1: 'Hello',
        col2: 'World',
    },
    {
        col1: 'react-table',
        col2: 'rocks',
    },
    {
        col1: 'whatever',
        col2: 'you want',
    },
    {
        col1: 'whatever',
        col2: 'you want',
    },
    {
        col1: 'whatever',
        col2: 'you want',
    },
    {
        col1: 'whatever',
        col2: 'you want',
    },
    {
        col1: 'whatever',
        col2: 'you want',
    },
    {
        col1: 'whatever',
        col2: 'you want',
    },
    {
        col1: 'whatever',
        col2: 'you want',
    },
    {
        col1: 'whatever',
        col2: 'you want',
    },
];

const columns: Array<Column> = [
    {
        Header: 'Column 1',
        accessor: 'col1',
    },
    {
        Header: 'Column 2',
        accessor: 'col2',
    },
];

interface QueueCounts {
    completed: number,
    failed: number
}

interface Props {
    // events: Array<string>
    // getStatus: Function
}

function Dashboard({ }: Props) {
    const [queueCounts, setQueueCounts] = useState<QueueCounts>();

    const host = window.location.hostname;
    const protocol = window.location.protocol;

    useEffect(() => {
        axios.get<QueueCounts, any>(`${AppConfig.getChannelsURL()}/stats`)
            .then(response => {
                console.log(response)
                setQueueCounts(response.data);
            })
            .catch(error => {
                console.log(error);
            })

        return () => { }
    }, [])

    return (
        <>
            <div className='grid grid-cols-4 gap-4'>
                <Card>
                    <div className='mb-2'>
                        <span className='uppercase font-semibold text-sm text-gray-400'>Channels analyzed</span>
                    </div>
                    <div className='mb-2'>
                        <span className='uppercase font-bold text-2xl'>{queueCounts?.completed || '-'}</span>
                    </div>
                    <div>
                        <ul className='text-xs text-gray-400'>
                            <li>...% more than last week</li>
                            <li>...% new orders</li>
                            <li>...% conversion rate</li>
                        </ul>
                    </div>
                </Card>
                <Card>
                    <div className='mb-2'>
                        <span className='uppercase font-semibold text-sm text-gray-400'>Jobs failed</span>
                    </div>
                    <div className='mb-2'>
                        <span className='uppercase font-bold text-2xl'>{queueCounts?.failed || '-'}</span>
                    </div>
                    <div>
                        <ul className='text-xs text-gray-400'>
                            <li>...% more than last week</li>
                            <li>...% new orders</li>
                            <li>...% conversion rate</li>
                        </ul>
                    </div>
                </Card>
                <Card>
                    <div className='mb-2'>
                        <span className='uppercase font-semibold text-sm text-gray-400'>Site visitors</span>
                    </div>
                    <div className='mb-2'>
                        <span className='uppercase font-bold text-2xl'>$35.2k</span>
                    </div>
                    <div>
                        <ul className='text-xs text-gray-400'>
                            <li>20.4% more than last week</li>
                            <li>33.5% new orders</li>
                            <li>6.21% conversion rate</li>
                        </ul>
                    </div>
                </Card>
                <Card>
                    <div className='mb-2'>
                        <span className='uppercase font-semibold text-sm text-gray-400'>Events</span>
                    </div>
                    <div className='mb-2'>
                        <span className='uppercase font-bold text-2xl'>...</span>
                    </div>
                    <div>
                        <ul className='text-xs text-gray-400'>
                            {
                                // events.map((event: string) => <li>{event}</li>)
                            }
                            {/* <button onClick={()=>{getStatus()}}>Emit</button> */}
                            {/* <li>20.4% more than last week</li>
                          <li>33.5% new orders</li>
                          <li>6.21% conversion rate</li> */}
                        </ul>
                    </div>
                </Card>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <Card>
                    <Table data={data} columns={columns} />
                </Card>
                <Card>
                    <Table data={data} columns={columns} />
                </Card>
                <Card>
                    <Table data={data} columns={columns} />
                </Card>
            </div>
        </>
    )
}

export default Dashboard
