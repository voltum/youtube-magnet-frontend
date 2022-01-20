import { TrashIcon } from '@heroicons/react/outline';
import axios from 'axios';
import React, { FormEvent, FormEventHandler, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom';
import { CellProps, Column } from 'react-table';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import Table from '../../components/Table'
import { useToggle } from '../../hooks/useToggle';
import { capitalizeFirstLetter } from '../../utils/common';

interface Collection{
    _id: string,
    name: string,
    type: string
}

interface Channel{
    id: string
    title: string
    url: string
    description: string
    email: string
    country: string
    language: string 
    socialLinks: string
    viewCount: number
    videoCount: number
    subscriberCount: number
    lastVideoPublishedAt: Date
    publishedAt: Date
}

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

const columns: Array<any> = [
    {
        Header: 'Title',
        accessor: 'title',
        Cell: (props: any) => <a href={props.row.original.url} target={'_blank'}>{props.value}</a>
    },
    {
        Header: 'Email',
        accessor: 'email',
        width: 100,
        minWidth: 50,
        maxWidth: 100,
        Cell: ({value}: any) => <>{value ? value : '-'}</>
    },
    {
        Header: 'Subscriber count',
        accessor: 'subscriberCount',
        Cell: ({value}: any) => <>{value?.toLocaleString()}</>
    },
    // {
    //     Header: 'Country',
    //     accessor: 'country',
    // },
    {
        Header: 'Language',
        accessor: 'language',
        Cell: ({value}: any) => <>{value ? value : '-'}</>
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


function Collections() {
    const collectionSelect = useRef<HTMLSelectElement>(null);
    const newFolderForm = useRef<HTMLFormElement>(null);
    const [currentCollection, setCurrentCollection] = useState<string | null | undefined>(localStorage.getItem('lastFolder'));
    const [collectionsList, setCollectionsList] = useState<any[]>([])
    const [channelsList, setChannelsList] = useState<any[]>([])
    const [modalToggle, setModalToggle] = useToggle(false);
    const [newFolderModalToggle, setNewFolderModalToggle] = useToggle(false);
    const [importModalToggle, setImportModalToggle] = useToggle(false);
    const host = window.location.hostname;
    const protocol = window.location.protocol;

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
        axios.get<Collection[]>(`${protocol}//${host}:3001/folders`)
        .then(response => {
            setCollectionsList(response.data.map(({_id, name, type}) => ({_id, name: capitalizeFirstLetter(name), type })));
        })
        .catch(error => {
            console.log(error);
        })
        return () => {}
    }, [])

    // useEffect(() => {
    //     setCurrentCollection(collectionSelect.current?.value);
    // }, [collectionSelect])

    useEffect(() => {
        axios.get<Channel[]>(`${protocol}//${host}:3001/channels`, { params: { folder: currentCollection }})
        .then(response => {
            setChannelsList(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }, [collectionsList, currentCollection])

    console.log(channelsList)

    function selectChanged(e: any){
        setCurrentCollection(collectionSelect.current?.value);
        localStorage.setItem('lastFolder', collectionSelect.current?.value || '');
        console.log(collectionSelect.current?.value);
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
                        <option value={''}>All</option>
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
                <Table data={channelsList} columns={columns} />
            </Card>
        </div>
    )
}

export default Collections
