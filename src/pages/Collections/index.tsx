import { IdentificationIcon, TrashIcon } from '@heroicons/react/outline';
import axios from 'axios';
import React, { FormEvent, FormEventHandler, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom';
import { CellProps, Column, ColumnGroup, Row } from 'react-table';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import Table, { Indicator, NumberRangeColumnFilter, SelectColumnFilter } from '../../components/Table'
import { useToggle } from '../../hooks/useToggle';
import { capitalizeFirstLetter } from '../../utils/common';
import { getChannelsList, getFoldersList } from '../../utils/channels';
import toast from 'react-hot-toast';
import Dropdown from '../../components/Dropdown';
import ModernDrawer from '../../components/Drawer';
import ChannelInfo from '../../components/ChannelInfo';
import { TabPanel, useTabs } from 'react-headless-tabs';
import { TabSelector } from '../../components/Tabs';
import { EmailIndicator } from '../../components/Table/EmailIndicator';
import { AppConfig } from '../../utils/config';


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
    const [infoDrawerToggle, setInfoDrawerToggle] = useToggle(false);
    const [drawerChannelID, setDrawerChannelID] = useState<string | null>(null);
    // Tabs
    const [ activeTab, setActiveTab ] = useTabs(['file', 'single'], 'file');
    // Elements
    const collectionSelect = useRef<HTMLSelectElement>(null);
    const newFolderForm = useRef<HTMLFormElement>(null);
    const importFileForm = useRef<HTMLFormElement>(null);
    const importSingleForm = useRef<HTMLFormElement>(null);
    // Const declarations
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    // Config axios TBD

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

    function newFolderFormSubmitted(e: any){
        e.preventDefault();
        const folderName = e.target.elements.folder_name.value;
        axios.post(`${AppConfig.getFoldersURL()}`, { name: folderName })
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
        const file: any = importFormData.get('file');

        const shouldUpdate: boolean = importFormData.get('should_update') ? true : false;
        
        if(!file.name){
            toast.error("Please, select a file!"); 
            return;
        }

        axios.post(`${AppConfig.getChannelsURL()}/upload`, importFormData, { params: { folder: currentCollection, shouldUpdate }})
            .then(response => {
                setImportModalToggle(false);
            }).catch(error => {
                toast.error('Error while making request!');
            }).finally(() => {
                const fileInput = importFileForm.current?.file;
                if(fileInput) fileInput.value = "";
            })
    }

    function importSingleFormSubmitted(e: any){
        e.preventDefault();
        const importSingleData = new FormData(e.target);
        const url: any = importSingleData.get('url');

        if(!url) { 
            toast.error("Please, enter channel's URL");
            return;
        }
        try{
            const urlObj = new URL(url);
        } catch {
            toast.error("Please, enter valid URL");
            return;
        }

        axios.post(`${AppConfig.getChannelsURL()}`, { url, folder: currentCollection, chunkStamp: chunks[0] })
            .then(response => {
                setImportModalToggle(false);
            }).catch(error => {
                toast.error('Error while making request!');
            }).finally(() => {
                const urlInput = importSingleForm.current?.url;
                if(urlInput) urlInput.value = "";
            })
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
                footer={()=><button form={activeTab === 'file' ? 'importChannelsForm' : 'importSingleChannelForm'} type='submit'><Button>Import</Button></button>}
            >
                {/* Tabs navigation */}
                <nav className='flex'>
                    <TabSelector isActive={activeTab === 'file'} onClick={() => setActiveTab('file')} >File</TabSelector>
                    <TabSelector isActive={activeTab === 'single'} onClick={() => setActiveTab('single')} >Single</TabSelector>
                </nav>

                {/* Tabs panels */}
                <TabPanel hidden={activeTab !== "file"}>
                    <form ref={importFileForm} id="importChannelsForm" onSubmit={importFormSubmitted}>
                        <input type="file" name="file" placeholder='Select scv file'></input>
                        <div className='my-3'>
                            <input type="checkbox" id="should_update" name="should_update" value={1} className='w-auto mr-2'/>
                            <label htmlFor="should_update" className='inline'>Should update</label>
                        </div>
                    </form>
                </TabPanel>

                <TabPanel hidden={activeTab !== "single"}>
                    <form ref={importSingleForm} id="importSingleChannelForm" onSubmit={importSingleFormSubmitted}>
                        <input type={'text'} name={'url'} placeholder='Input channel url'></input>
                    </form>
                </TabPanel>

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
                    <div onClick={() => refresh()}><Button>Refresh</Button></div>
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
