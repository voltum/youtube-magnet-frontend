import { IdentificationIcon, TrashIcon } from '@heroicons/react/outline';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { Column } from 'react-table';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Table, { Indicator, NumberRangeColumnFilter, SelectColumnFilter } from '../../components/Table'
import { useToggle } from '../../hooks/useToggle';
import { capitalizeFirstLetter } from '../../utils/common';
import { getChannelsList, getFoldersList } from '../../utils/channels';
import toast from 'react-hot-toast';
import ModernDrawer from '../../components/Drawer';
import ChannelInfo from '../../components/ChannelInfo';
import { EmailIndicator } from '../../components/Table/EmailIndicator';
import { AppConfig } from '../../utils/config';
import ModalService from '../../modules/modals/services/ModalService';
import ManageModal from '../../components/Modal/ManageModal';
import ImportModal from '../../components/Modal/ImportModal';
import NewFolderModal from '../../components/Modal/NewFolderModal';


function Collections() {
    // Collections
    const [collectionsList, setCollectionsList] = useState<any[]>([]);
    const [currentCollection, setCurrentCollection] = useState<string | null | undefined>();
    // Channels
    const [channelsList, setChannelsList] = useState<any[]>([]);
    const [chunks, setChunks] = useState<Array<number>>([]);
    const [channelsLoading, setChannelsLoading] = useState(true);
    // Modals
    const [infoDrawerToggle, setInfoDrawerToggle] = useToggle(false);
    const [drawerChannelID, setDrawerChannelID] = useState<string | null>(null);
    // Elements
    const collectionSelect = useRef<HTMLSelectElement>(null);

    const columns: Array<Column<{}>> = [
        {
            Header: '#',
            accessor: 'index',
            Cell: (props: any) => <>{Number(props.row.id) + 1}</>,
            width: 50
        },
        {
            Header: '⦀',
            accessor: 'chunkStamp',
            Cell: (props: any) => <>{<Indicator type={props.value === chunks[0] ? 'new' : props.value === chunks[1] ? 'secondNew' : undefined} /> }</>,
            width: 40
        },
        {
            Header: 'Title',
            accessor: 'title',
            Cell: (props: any) => <a href={props.row.original.url} target={'_blank'}>{props.value}</a>,
            width: 150,
            
        },
        {
            Header: '',
            accessor: 'emailExists',
            Filter: SelectColumnFilter,
            Cell: ({value, row}: any) => <>{<EmailIndicator type={value} />}</>,
            width: 30
        },
        {
            Header: 'Email',
            accessor: 'email',
            Cell: ({value, row}: any) => <>{<input type={'email'} id={`input_email_${row.original._id}`} defaultValue={value} placeholder='Put email' onKeyPress={(e) => e.key === 'Enter' && updateEmail(e, row.original._id, e.currentTarget.value)} autoComplete={`input_email_${row.original._id}`} className={value ? 'opacity-50 ring-green-700' : 'ring-slate-300'} />}</>,
            width: 210
        },
        {
            Header: 'Subscriber count',
            accessor: 'subscriberCount',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            aggregate: 'sum',
            Cell: ({value}: any) => <>{value ? value.toLocaleString() : <span className='text-yellow-500 text-xs'>HIDDEN</span>}</>,
            width: 140
        },
        // {
        //     Header: 'Country',
        //     accessor: 'country',
        // },
        {
            Header: 'Language',
            accessor: 'language',
            Cell: ({value}: any) => <>{value ? value : <span className='text-yellow-500 text-xs'>N/A</span>}</>,
            width: 120
        },
        {
            Header: 'View count',
            accessor: 'viewCount',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            Cell: ({value}: any) => <>{value?.toLocaleString()}</>,
            width: 120
        },
        {
            Header: 'Video count',
            accessor: 'videoCount',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            Cell: ({value}: any) => <>{value?.toLocaleString()}</>,
            width: 100
        },
        {
            Header: 'Last video',
            accessor: 'lastVideoPublishedAt',
            Cell: ({value}: any) => <>{moment(value).fromNow()}</>,
        },
        {
            Header: 'Opts',
            accessor: 'options',
            Cell: ({value, row}: any) => <><button onClick={()=>openInfoDrawer(row.original._id)}><IdentificationIcon className='w-5 h-5' /></button></>,
            width: 50
        }
    ];

    const collectionsColumns: Array<Column> = [
        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Options',
            accessor: 'options',
            Cell: (props: any) => <>
                <button className='text-red-300 hover:text-red-400' onClick={() => {
                    deleteFolder(props.row.original._id).then(response => window.location.reload()).catch(error => console.log(error));
                }}><TrashIcon className='w-4 h-4 pb-0.5 inline-block' /> Delete</button>
            </>
        },
    ];

    const deleteFolder = (id: string) => {
        return axios.delete(`${AppConfig.getFoldersURL()}/${id}`);
    }

    useEffect(() => {

        getFoldersList().then(response => {
            setCollectionsList(response.data.map(({_id, name, type}) => ({_id, name: capitalizeFirstLetter(name), type })));
        }).catch((error)=>{                                    
            toast.error(error);
        })

    }, []);

    useEffect(() => {
        setCurrentCollection(localStorage.getItem('lastFolder') || collectionsList[0]?.name);
    }, [collectionsList])

    useEffect(() => {
        if(!channelsList.length) return;

        const tempSet = new Set<number>();
        console.log('Chunking')
        // Add each chunk timestamp into set
        channelsList.forEach(channel => {
            channel.chunkStamp && tempSet.add(channel.chunkStamp);
        });

        // Set chunks in reverse order
        setChunks(Array.from(tempSet).sort(function(a, b){return b-a}));
    }, [channelsList])

    useEffect(() => {
        if(!currentCollection) return;
        
        // Start loading
        setChannelsLoading(true);

        // Function call
        getChannelsList(currentCollection).then(response => {
            console.log('response!!!');
            // Set the data
            setChannelsList(response.data);
        }).catch(error => {
            // Make a notification
            console.log('Channels', error)
            toast.error(error);
        }).finally(() => {
            // Stop loading
            setChannelsLoading(false);
        });

    }, [currentCollection])

    function selectChanged(e: any){
        setCurrentCollection(collectionSelect.current?.value);
        localStorage.setItem('lastFolder', collectionSelect.current?.value || '');
    }

    function updateEmail(e: any, id: string, email: string){
        e.preventDefault();
        axios.put(`${AppConfig.getChannelsURL()}`, { email }, { params: { id }})
            .then(response => {
                toast.success('Email updated!');
                const cur = currentCollection;
                refresh();              
            })
            .catch(error => {
                toast.error('Error while updating email');
            })
    }

    function deleteChannel(id: string){
        axios.delete(`${AppConfig.getChannelsURL()}/${id}`)
            .then(response => {
                toast.success('Channel has been deleted!');
                refresh();
            })
            .catch(error => {
                toast.error('Error while deleting the channel');
            })
    }

    function downloadChannels(folder: string){
        window.location.assign(`${AppConfig.getChannelsURL()}/export?folder=${folder}`);
    }

    function openInfoDrawer(id: string){
        setDrawerChannelID(id);
        setInfoDrawerToggle(true);
    }

    function refresh(){
        const cur = currentCollection;
        setCurrentCollection('');
        setTimeout(() => {
            setCurrentCollection(cur);
        }, 300);
        
        console.log('Opened')
    }

    function openNewFolderModal(){
        ModalService.open(NewFolderModal);
    }

    function openManageModal(){
        ModalService.open(ManageModal, { data: { rows: collectionsList, columns: collectionsColumns }});
    }

    function openImportModal(){
        ModalService.open(ImportModal, { currentCollection, chunks });
    }

    return (
        <div>
            <ModernDrawer
                isOpen={infoDrawerToggle}
                onClose={()=>(setInfoDrawerToggle(false))}
                direction='right'
                className='p-4 w-32'
                title='Channel info'
                width={500}
                footer={()=> (
                    <div onClick={() => {
                        let conf = window.confirm(`Are you sure to delete this channel?`);
                        if(conf && drawerChannelID) deleteChannel(drawerChannelID);
                    }}><Button type='danger'>Delete</Button></div>
                )}
            >
                {<ChannelInfo data={channelsList.find(element => element._id === drawerChannelID)} />}
            </ModernDrawer>


            <div className='flex justify-between gap-4'>
                {collectionsList?
                    <select className='min-w-min mb-4 p-1 bg-slate-600 outline-none capitalize' ref={collectionSelect} onChange={selectChanged} value={currentCollection || ''}>
                        {/* <option value={''}>All</option> */}
                        {collectionsList.map((collection) => (<option value={collection.name} key={collection.name} className='capitalize'>{collection.name}</option>))}
                    </select>
                    : 'Loading'
                }
                <div className='flex gap-2'>
                    {currentCollection?<div onClick={openImportModal}><Button>Import channels</Button></div>:null}
                    {currentCollection?<div onClick={() => downloadChannels(currentCollection)}><Button>Download channels</Button></div>:null}
                    <div onClick={openNewFolderModal}><Button>Add new collection</Button></div>
                    <div onClick={openManageModal}><Button>Manage collections</Button></div>
                    <div onClick={refresh}><Button>Refresh</Button></div>
                </div>
            </div>
            <Card>
                <Table data={channelsList} columns={columns} pagination={{ defaultPageSize: 30 }}
                    filter={{
                        search: {
                            filters: ['title', 'email']
                        },
                        between: true
                    }}
                    isLoading={channelsLoading}
                />
            </Card>
        </div>
    )
}

export default Collections
