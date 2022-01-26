import { TrashIcon } from '@heroicons/react/outline';
import axios from 'axios';
import React, { FormEvent, FormEventHandler, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom';
import { CellProps, Column, Row } from 'react-table';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import Table, { Indicator } from '../../components/Table'
import { useToggle } from '../../hooks/useToggle';
import { capitalizeFirstLetter } from '../../utils/common';
import { getChannelsList, getFoldersList } from '../../utils/channels';
import toast from 'react-hot-toast';


function Collections() {
    // Collections
    const [collectionsList, setCollectionsList] = useState<any[]>([]);
    const [currentCollection, setCurrentCollection] = useState<string | null | undefined>();
    // Channels
    const [channelsList, setChannelsList] = useState<any[]>([]);
    const [chunks, setChunks] = useState<Array<number>>([]);
    const [channelsLoading, setChannelsLoading] = useState(true);
    // Modals
    const [modalToggle, setModalToggle] = useToggle(false);
    const [newFolderModalToggle, setNewFolderModalToggle] = useToggle(false);
    const [importModalToggle, setImportModalToggle] = useToggle(false);
    // Elements
    const collectionSelect = useRef<HTMLSelectElement>(null);
    const newFolderForm = useRef<HTMLFormElement>(null);
    // Const declarations
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    // Config axios TBD

    const columns: Array<any> = [
        {
            Header: '#',
            accessor: 'index',
            Cell: (props: any) => <>{Number(props.row.id) + 1}</>
        },
        {
            Header: '⦀',
            accessor: 'chunkStamp',
            Cell: (props: any) => <>{<Indicator type={props.value === chunks[0] ? 'new' : props.value === chunks[1] ? 'secondNew' : undefined} /> }</>
        },
        {
            Header: 'Title',
            accessor: 'title',
            Cell: (props: any) => <a href={props.row.original.url} target={'_blank'}>{props.value}</a>,
            style: {
                width: 100,
                minWidth: 50,
                maxWidth: 100
            }
        },
        {
            Header: 'Email',
            accessor: 'email',
            Cell: ({value, row}: any) => <>{<input type={'email'} id={`input_email_${row.original._id}`} defaultValue={value} placeholder='Put email' onKeyPress={(e) => e.key === 'Enter' && updateEmail(e, row.original._id, e.currentTarget.value)} autoComplete={`input_email_${row.original._id}`} className={value ? 'opacity-50 ring-green-700' : 'ring-slate-300'} />}</>,
            style: {
                width: 100,
                minWidth: 50,
                maxWidth: 100
            }
        },
        {
            Header: 'Subscriber count',
            accessor: 'subscriberCount',
            Cell: ({value}: any) => <>{value ? value.toLocaleString() : <span className='text-yellow-500 text-xs'>HIDDEN</span>}</>
        },
        // {
        //     Header: 'Country',
        //     accessor: 'country',
        // },
        {
            Header: 'Language',
            accessor: 'language',
            Cell: ({value}: any) => <>{value ? value : <span className='text-yellow-500 text-xs'>N/A</span>}</>
        },
        // {
        //     Header: 'Social links',
        //     accessor: 'socialLinks',
        // },
        {
            Header: 'View count',
            accessor: 'viewCount',
            Cell: ({value}: any) => <>{value?.toLocaleString()}</>
        },
        {
            Header: 'Video count',
            accessor: 'videoCount',
            Cell: ({value}: any) => <>{value?.toLocaleString()}</>
        },
        {
            Header: 'Last video',
            accessor: 'lastVideoPublishedAt',
            Cell: ({value}: any) => <>{moment(value).fromNow()}</>
        },
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
        return axios.delete(`${protocol}//${host}:3001/folders/${id}`);
    }

    useEffect(() => {

        getFoldersList().then(response => {
            setCollectionsList(response.data.map(({_id, name, type}) => ({_id, name: capitalizeFirstLetter(name), type })));
        }).catch((error)=>{
            // Make a notification
            console.log('Folders',error)
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

    function newFolderFormSubmitted(e: any){
        e.preventDefault();
        const folderName = e.target.elements.folder_name.value;
        axios.post(`${protocol}//${host}:3001/folders`, { name: folderName })
            .then(response => {
                window.location.reload();
            })
            .catch(error => {
                console.log(error);
            });
    }

    function importFormSubmitted(e: any){
        e.preventDefault();
        const importFormData = new FormData(e.target);
        axios.post(`${protocol}//${host}:3001/channels/upload`, importFormData, { params: { folder: currentCollection }})
            .then(response => {
                setImportModalToggle(false);
            })
    }

    function updateEmail(e: any, id: string, email: string){
        e.preventDefault();
        axios.put(`${protocol}//${host}:3001/channels`, { email }, { params: { id }})
            .then(response => {
                toast.success('Email updated!');
                const cur = currentCollection;
                setCurrentCollection('');
                setCurrentCollection(currentCollection);
              
            })
            .catch(error => {
                toast.error('Error while updating email');
            })
    }

    function downloadChannels(folder: string){
        window.location.assign(`${protocol}//${host}:3001/channels/export?folder=${folder}`);
    }

    return (
        <div>
            <Modal 
                visible={modalToggle} 
                onCancel={()=>setModalToggle(false)}
                header={()=>'Header'}
                footer={()=><div onClick={()=> { setModalToggle(false); setNewFolderModalToggle(true) }}><Button>Add new collection</Button></div>}
            >
                <Table data={collectionsList} columns={collectionsColumns} />
            </Modal>

            <Modal 
                visible={newFolderModalToggle} 
                onCancel={()=>setNewFolderModalToggle(false)}
                header={()=>'Add new folder'}
                footer={()=><button form='newFolderForm' type='submit'><Button>Create new folder</Button></button>}
            >
                <form ref={newFolderForm} id="newFolderForm" onSubmit={newFolderFormSubmitted}>
                    <input name="folder_name" placeholder='Folder name'></input>
                </form>
            </Modal>

            <Modal 
                visible={importModalToggle} 
                onCancel={()=>setImportModalToggle(false)}
                header={()=>'Import channels'}
                footer={()=><button form='importChannelsForm' type='submit'><Button>Import</Button></button>}
            >
                <form ref={newFolderForm} id="importChannelsForm" onSubmit={importFormSubmitted}>
                    <input type="file" name="file" placeholder='Select scv file'></input>
                </form>
            </Modal>

            <div className='flex justify-between gap-4'>
                {collectionsList?
                    <select className='min-w-min mb-4 p-1 bg-slate-600 outline-none capitalize' ref={collectionSelect} onChange={selectChanged}value={currentCollection || ''}>
                        {/* <option value={''}>All</option> */}
                        {collectionsList.map((collection) => (<option value={collection.name} key={collection.name} className='capitalize'>{collection.name}</option>))}
                    </select>
                    : 'Loading'
                }
                <div className='flex gap-2'>
                    {currentCollection?<div onClick={setImportModalToggle}><Button>Import channels</Button></div>:null}
                    {currentCollection?<div onClick={() => downloadChannels(currentCollection)}><Button>Download channels</Button></div>:null}
                    <div onClick={setNewFolderModalToggle}><Button>Add new collection</Button></div>
                    <div onClick={setModalToggle}><Button>Manage collections</Button></div>
                    <div onClick={()=>{setCurrentCollection(''); setCurrentCollection(currentCollection)}}><Button>Refresh</Button></div>
                </div>
            </div>
            <Card>
                <Table data={channelsList} columns={columns} pagination={{ defaultPageSize: 30 }}
                    filter={{
                        search: {
                            filters: ['title', 'email']
                        }
                    }}
                    isLoading={channelsLoading}
                />
            </Card>
        </div>
    )
}

export default Collections
