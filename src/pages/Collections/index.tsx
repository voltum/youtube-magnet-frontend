import { IdentificationIcon, RefreshIcon, TrashIcon } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { ChangeEvent, ChangeEventHandler, KeyboardEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { Column } from 'react-table';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Table, { Indicator, NumberRangeColumnFilter, SelectColumnFilter, SelectColumnFilterGeneral } from '../../components/Table'
import { useToggle } from '../../hooks/useToggle';
import { capitalizeFirstLetter, parseToTree, useQuery } from '../../utils/common';
import { Channel, Folder, FolderType, getChannelsList, getFoldersList, remakeFolder, updateChannel } from '../../utils/channels';
import toast from 'react-hot-toast';
import ModernDrawer from '../../components/Drawer';
import ChannelInfo from '../../components/ChannelInfo';
import { EmailIndicator } from '../../components/Table/EmailIndicator';
import { AppConfig } from '../../utils/config';
import ModalService from '../../modules/modals/services/ModalService';
import ManageModal from '../../components/Modal/ManageModal';
import ImportModal from '../../components/Modal/ImportModal';
import NewFolderModal from '../../components/Modal/NewFolderModal';
import Cascader from '../../components/Cascader';


function Collections() {
    let query = useQuery();
    let navigate = useNavigate();
    // Collections
    const [collectionsList, setCollectionsList] = useState<any[]>([]);
    const [currentCollection, setCurrentCollection] = useState<string | null | undefined>();
    const [foldersList, setFoldersList] = useState<any[]>([]);
    const [pureCategories, setPureCategories] = useState<any[]>([]);
    const [dumbCounter, setDumbCounter] = useState(0);
    // Channels
    const [channelsList, setChannelsList] = useState<Channel[]>([]);
    const [chunks, setChunks] = useState<Array<number | undefined>>([]);
    const [channelsLoading, setChannelsLoading] = useState(true);
    // Modals
    const [infoDrawerToggle, setInfoDrawerToggle] = useToggle(false);
    const [drawerChannelID, setDrawerChannelID] = useState<string | null>(null);
    // Elements
    const collectionSelect = useRef<HTMLSelectElement>(null);
    const [isBlacklist, setIsBlacklist] = useState(false);

    const columns: Array<Column<{}>> = [
        {
            Header: '#',
            accessor: 'index',
            Cell: (props: any) => <>{Number(props.row.id) + 1}</>,
            width: 50
        },
        {
            Header: 'S',
            accessor: 'chunkStamp',
            Cell: (props: any) => <>{<Indicator type={getFolder(props.row.original)?.chunkStamp === chunks[0] ? 'new' : getFolder(props.row.original)?.chunkStamp === chunks[1] ? 'secondNew' : undefined} />}</>,
            width: 32
        },
        {
            Header: 'Title',
            accessor: 'title',
            Cell: (props: any) => <a href={props.row.original.url} target={'_blank'} onContextMenu={e => { e.stopPropagation() }}>{props.value}</a>,
            width: 130,

        },
        {
            Header: '',
            accessor: 'emailExists',
            Filter: SelectColumnFilter,
            Cell: ({ value, row }: any) => <>{<EmailIndicator type={value} />}</>,
            width: 35
        },
        {
            Header: 'Email',
            accessor: 'email',
            Cell: ({ value, row }: any) => <span onContextMenu={e => { e.stopPropagation() }}>{<input type={'email'} id={`input_email_${row.original._id}`} defaultValue={value} placeholder='Put email' onKeyPress={(e) => e.key === 'Enter' && updateEmail(e, row.original._id, e.currentTarget.value)} autoComplete={`input_email_${row.original._id}`} className={`w-full ${value ? 'opacity-50 ring-green-700' : 'ring-slate-300'}`} />}</span>,
            width: 150
        },
        {
            Header: 'Subscribers',
            accessor: 'subscriberCount',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            aggregate: 'sum',
            Cell: ({ value }: any) => <>{value ? value.toLocaleString() : <span className='text-yellow-500 text-xs'>HIDDEN</span>}</>,
            width: 110
        },
        // {
        //     Header: 'Country',
        //     accessor: 'country',
        // },
        {
            Header: 'Language',
            accessor: 'language',
            Filter: SelectColumnFilterGeneral,
            Cell: ({ value, row }: any) => <><span onContextMenu={e => { e.stopPropagation() }}>{<input type={'text'} id={`input_language_${row.original._id}`} defaultValue={value} placeholder='N/A' onKeyPress={(e) => e.key === 'Enter' && updateLanguage(e, row.original._id)} autoComplete={`input_language_${row.original._id}`} className={`w-full ${value ? 'opacity-70' : 'ring-slate-200'}`} />}</span></>,
            width: 100
        },
        {
            Header: 'Country',
            accessor: 'country',
            Filter: SelectColumnFilterGeneral,
            Cell: ({ value, row }: any) => <><span onContextMenu={e => { e.stopPropagation() }}>{<input type={'text'} id={`input_language_${row.original._id}`} defaultValue={value} placeholder='N/A' onKeyPress={(e) => e.key === 'Enter' && updateCountry(e, row.original._id)} autoComplete={`input_language_${row.original._id}`} className={`w-full ${value ? 'opacity-70' : 'ring-slate-200'}`} />}</span></>,
            width: 80
        },
        {
            Header: 'View count',
            accessor: 'viewCount',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            Cell: ({ value }: any) => <>{value?.toLocaleString()}</>,
            width: 120
        },
        {
            Header: 'Video count',
            accessor: 'videoCount',
            Filter: NumberRangeColumnFilter,
            filter: 'between',
            Cell: ({ value }: any) => <>{value?.toLocaleString()}</>,
            width: 100
        },
        {
            Header: 'Last video',
            accessor: 'lastVideoPublishedAt',
            Cell: ({ value }: any) => <>{moment(value).fromNow()}</>,
            width: 100
        },
        {
            Header: 'Notes',
            accessor: 'localNote',
            Cell: ({ value, row }: any) => <>
                <textarea className='w-full h-7' onKeyDown={(e) => updateLocalNote(e, row.original._id)} defaultValue={getFolder(row.original)?.note} /></>,
            width: 120
        },
        {
            Header: 'Opts',
            accessor: 'options',
            Cell: ({ value, row }: any) => <><button onClick={() => openInfoDrawer(row.original._id)}><IdentificationIcon className='w-5 h-5' /></button></>,
            width: 50
        }
    ];

    const collectionsColumns: Array<Column> = [
        {
            // Build our expander column
            id: 'expander', // Make sure it has an ID
            Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
                <span {...getToggleAllRowsExpandedProps()}>
                    {isAllRowsExpanded ? '🔽' : '▶️'}
                </span>
            ),
            Cell: ({ row }) =>
                // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
                // to build the toggle for expanding a row
                row.canExpand ? (
                    <span
                        {...row.getToggleRowExpandedProps({
                            style: {
                                // We can even use the row.depth property
                                // and paddingLeft to indicate the depth
                                // of the row
                                paddingLeft: `${row.depth * 1.8}rem`,
                            },
                        })}
                    >
                        {row.isExpanded ? '🔽' : '▶️'}
                    </span>
                ) : null,
            width: 50
        },
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
                <button className='text-blue-300 hover:text-blue-400 ml-2' onClick={() => remake(props.row.original._id, props.row.original.category)}>
                    <RefreshIcon className='w-4 h-4 pb-0.5 inline-block' /> Remake
                </button>
            </>
        },
    ];

    const getFolder = (channel: any): FolderType => {
        return channel.folders?.find((folder: FolderType) => (folder.name === query.get('folder'))) as FolderType;
    }

    const remake = (id: string, name?: string) => {
        const confirmed = window.confirm(`Are you sure you want to remake the category${name ? ' ' + name : ''}?`);

        if (confirmed) {
            remakeFolder(id).then(res => {
                console.log(res);
            }).catch(error => {
                toast.error('Error while making remake query');
            });
        }
    }

    const deleteFolder = (id: string) => {
        return axios.delete(`${AppConfig.getFoldersURL()}/${id}`);
    }

    useEffect(() => {
        console.log("Config", process.env)

        getFoldersList().then(response => {
            const foldersTree = parseToTree(response.data);
            setPureCategories(response.data);
            setFoldersList(parseToTree(response.data, "/", "subRows"));
            setCollectionsList(foldersTree);
        }).catch((error) => {
            toast.error(error);
        })

    }, []);

    useEffect(() => {
        setCurrentCollection(query.get('folder') || localStorage.getItem('lastFolder'));
    }, [query])

    useEffect(() => {
        if (!channelsList.length) return;

        const tempSet = new Set<number | undefined>();
        // Add each chunk timestamp into set
        channelsList.forEach(channel => {
            let chunkStamp = channel.folders.find(folder => folder.name === query.get('folder'))?.chunkStamp;
            tempSet.add(chunkStamp);
        });
        // Set chunks in descending order
        const chunksArray = Array.from(tempSet).sort(function (a, b) { return Number(b) - Number(a) });
        setChunks(chunksArray);
    }, [channelsList, query]);

    useEffect(() => {
        if (!currentCollection) return;

        // Start loading
        setChannelsLoading(true);

        // Function call
        getChannelsList(currentCollection, isBlacklist).then(response => {
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

    }, [currentCollection, isBlacklist, dumbCounter])

    const selectChanged = useCallback(
        (value: string) => {
            navigate(`${window.location.pathname}?folder=${encodeURIComponent(value)}`);
            setCurrentCollection(value);
            localStorage.setItem('lastFolder', value || '');
        }, [query]
    )

    function updateLanguage(e: React.KeyboardEvent<HTMLInputElement>, id: string) {
        e.preventDefault();
        const language = e.currentTarget.value.toUpperCase();
        e.currentTarget.value = language;
        e.currentTarget.blur();
        axios.put(`${AppConfig.getChannelsURL()}`, { update: { language } }, { params: { id } })
            .then(response => {
                toast.success('Language updated!');
            })
            .catch(error => {
                toast.error('Error while updating language');
            })
    }

    function updateCountry(e: React.KeyboardEvent<HTMLInputElement>, id: string) {
        e.preventDefault();
        const country = e.currentTarget.value.toUpperCase();
        e.currentTarget.value = country;
        e.currentTarget.blur();
        axios.put(`${AppConfig.getChannelsURL()}`, { update: { country } }, { params: { id } })
            .then(response => {
                toast.success('Country updated!');
            })
            .catch(error => {
                toast.error('Error while updating country');
            })
    }

    function updateEmail(e: React.KeyboardEvent<HTMLInputElement>, id: string, email: string) {
        e.preventDefault();
        e.currentTarget.blur();
        axios.put(`${AppConfig.getChannelsURL()}`, { update: { email } }, { params: { id } })
            .then(response => {
                toast.success('Email updated!');
                // refresh();
            })
            .catch(error => {
                toast.error('Error while updating email');
            })
    }

    function deleteChannel(id: string) {
        axios.delete(`${AppConfig.getChannelsURL()}/${id}`, { params: { from: currentCollection } })
            .then(response => {
                toast.success('Channel has been deleted!');
                refresh();
            })
            .catch(error => {
                toast.error('Error while deleting the channel');
            })
    }

    function downloadChannels(folder: string, blacklist?: boolean) {
        window.location.assign(`${AppConfig.getChannelsURL()}/export?folder=${folder}${blacklist ? "&blacklist=true" : ""}`);
    }

    function openInfoDrawer(id: string) {
        setDrawerChannelID(id);
        setInfoDrawerToggle(true);
    }

    function updateLocalNote(e: React.KeyboardEvent<HTMLTextAreaElement>, id: string) {
        const currentFolder = query.get('folder');
        const value = e.currentTarget.value;
        if (!e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            if (currentFolder) {
                updateChannel(id, { "folders.$[element].note": value }, { arrayFilters: [{ "element.name": currentFolder }] })
                    .then((res) => {
                        toast.success(`Note has been updated!`);
                    })
                    .catch((error) => {
                        toast.error(error.toString());
                    })

            } else {
                toast.error('No folder selected');
            }
        }
        // console.log(e.shiftKey)
    }

    function globalSearchChanged(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            if (e.currentTarget.value.length >= 4) {
                console.log(e.currentTarget.value);

                // Start loading
                setChannelsLoading(true);

                // Function call
                getChannelsList(undefined, undefined, {
                    $or: [
                        { title: { $regex: `${e.currentTarget.value}`, $options: 'i' } },
                        { email: { $regex: `${e.currentTarget.value}`, $options: 'i' } },
                        { url: { $regex: `${e.currentTarget.value}` } }
                    ]
                }).then(response => {
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
            } else {
                if (!e.currentTarget.value) {
                    setDumbCounter(dumbCounter + 1);
                } else toast('Search query must contain 4 or more characters');
            }
        }
    }

    function refresh() {
        const cur = currentCollection;
        setCurrentCollection('');
        setTimeout(() => {
            setCurrentCollection(cur);
        }, 300);

        console.log('Opened')
    }

    function openNewFolderModal() {
        ModalService.open(NewFolderModal, { data: { folders: pureCategories } });
    }

    function openManageModal() {
        ModalService.open(ManageModal, { data: { rows: foldersList, columns: collectionsColumns } });
    }

    function openImportModal() {
        ModalService.open(ImportModal, { currentCollection, chunks });
    }

    return (
        <div>
            <ModernDrawer
                isOpen={infoDrawerToggle}
                onClose={() => (setInfoDrawerToggle(false))}
                direction='right'
                className='p-4 w-32'
                title='Channel info'
                width={500}
                footer={() => (
                    <div onClick={() => {
                        let conf = window.confirm(`Are you sure to delete this channel?`);
                        if (conf && drawerChannelID) deleteChannel(drawerChannelID);
                    }}><Button type='danger'>Delete</Button></div>
                )}
            >
                {<ChannelInfo data={channelsList.find(element => element._id === drawerChannelID)} />}
            </ModernDrawer>


            <div className='flex justify-between gap-4'>
                {collectionsList ?
                    // <select className='min-w-min mb-4 p-1 bg-slate-600 outline-none capitalize' ref={collectionSelect} onChange={selectChanged} value={currentCollection || ''}>
                    //     {/* <option value={''}>All</option> */}
                    //     {collectionsList.map((collection) => (<option value={collection.category} key={collection.category} className='capitalize'>{collection.name}</option>))}
                    // </select>
                    <Cascader options={collectionsList} onChange={selectChanged} value={currentCollection || 'Select a category'} />
                    : 'Loading'
                }
                <div>

                </div>
                <div className='flex gap-2'>
                    {query ? query.get('nonon') : 'No query'}
                    <div className={isBlacklist ? 'border-b-4 border-red-400' : ''}><Button onClick={() => setIsBlacklist(!isBlacklist)}>Blacklist</Button></div>
                    {currentCollection ? <div onClick={openImportModal}><Button>Import channels</Button></div> : null}
                    {currentCollection ? <div onClick={() => downloadChannels(currentCollection)}><Button>Export all</Button></div> : null}
                    {currentCollection ? <div onClick={() => downloadChannels(currentCollection, true)}><Button>Export blacklist</Button></div> : null}
                    <div onClick={openNewFolderModal}><Button>Add new collection</Button></div>
                    <div onClick={openManageModal}><Button>Manage collections</Button></div>
                    <div onClick={refresh}><Button>Refresh</Button></div>
                </div>
            </div>
            <div className='mb-3'><input type={'text'} placeholder={'🔍 Global search'} onKeyPress={globalSearchChanged} name={'global_search'} /></div>
            <Card secondBorder={isBlacklist ? 'red' : undefined}>
                {currentCollection ?
                    <Table data={channelsList} columns={columns} folders={collectionsList} pagination={{ defaultPageSize: 30 }}
                        filter={{
                            search: {
                                filters: ['title', 'email']
                            },
                            between: true
                        }}
                        isLoading={channelsLoading}
                    />
                    :
                    'Select a folder'
                }
            </Card>
        </div>
    )
}

export default Collections
