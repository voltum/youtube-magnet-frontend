import { ArrowCircleRightIcon, ArrowNarrowRightIcon, ArrowRightIcon, ClipboardCopyIcon, ExternalLinkIcon, MailIcon, PaperClipIcon, TrashIcon } from '@heroicons/react/outline';
import { ControlledMenu, FocusableItem, Menu, MenuButton, MenuGroup, MenuHeader, MenuItem, MenuState, SubMenu } from '@szhsin/react-menu';
import { HTMLAttributes, useState } from 'react';
import toast from 'react-hot-toast';
import { blockChannel, changeChannelFolder, Channel, updateChannel } from '../../utils/channels';
import Button from '../Button';
import ContextMenuItem from './ContextMenuItem';
import "./style.scss"
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { matchSorter } from 'match-sorter';
import { useQuery } from '../../utils/common';
import { socket } from '../../modules/modals/services/Socket';

export interface ContextMenuItemProps<T> extends HTMLAttributes<T> {
    name?: string
    category?: string
    children?: Array<object> | undefined,
    onItemClick?: (category: string | undefined) => void
}

interface ItemClickProps {
    id: string | undefined
    category: string | undefined
}

interface ContextMenuProps {
    items: Array<ContextMenuItemProps<any>> | undefined,
    menuProps: {
        state?: MenuState;
        endTransition: () => void;
    },
    toggleMenu: (a: boolean) => void,
    anchorPoint: { x: number, y: number },
    details?: Channel | null
}

interface SelectorMenuProps extends ContextMenuProps {
    onItemClick?: (item: string | undefined) => void
}

function ContextMenu(data: ContextMenuProps) {
    let query = useQuery();
    const isBlocked = data.details?.folders.some((folder) => folder.blocked === true);

    const handleBlock = (target?: boolean) => {
        const currentFolder = query.get('folder');
        if (!currentFolder) {
            toast.error('Folder not selected'); return;
        }
        const confirmed = window.confirm('Are you sure?');
        if (confirmed && data.details?._id)
            blockChannel(data.details?._id, currentFolder, target)
                .then((res) => {
                    toast.success(`Channel ${data.details?.title} ${target ? 'blocked' : 'unblocked'}!`);
                })
                .catch((error) => {
                    toast.error(error);
                })
    }

    const handleOpen = (url: string | undefined) => {
        url ? window.open(url, '_blank') : alert('No link');
    }

    const handleSendClick = (category: string | undefined) => {
        const currentFolder = query.get('folder');
        if (!currentFolder) {
            toast.error('Folder not selected'); return;
        }
        changeChannelFolder(data.details?._id, currentFolder, category)?.then((res) => {
            toast.success(`Channel ${data.details?.title} sent to ${category}`)
        })
            .catch((error) => toast.error(error));
        console.log('Item clicked', data.details?._id)
        console.log('Item clicked', category)
    }

    const handleCopy = (text: string | undefined, message?: string) => {
        if (text) {
            navigator.clipboard.writeText(text);
            toast(message || 'Copied');
        }
    }

    return (
        <ControlledMenu {...data.menuProps} anchorPoint={data.anchorPoint} theming="dark" onClose={() => data.toggleMenu(false)}>
            <MenuHeader style={{ textTransform: 'initial' }}>
                {data.details?.title}
            </MenuHeader>
            <MenuItem onClick={() => handleOpen(data.details?.url)}>
                <ExternalLinkIcon className='w-4 h-4 mr-2' />
                Open
            </MenuItem>
            <MenuItem onClick={() => handleOpen(data.details?.url + '/about')}>
                <ExternalLinkIcon className='w-4 h-4 mr-2' />
                Open about page
            </MenuItem>
            {/* <MenuItem onClick={() => handleCopy(data.details?.url, `URL of ${data.details?.title} copied`)}>
                <ClipboardCopyIcon className='w-4 h-4 mr-2' />
                Copy url
            </MenuItem>
            <MenuItem onClick={() => handleCopy(data.details?.email, `Email of ${data.details?.title} copied`)}>
                <ClipboardCopyIcon className='w-4 h-4 mr-2' />
                Copy email
            </MenuItem> */}
            <SubMenu label={
                <>
                    <ArrowCircleRightIcon className='w-4 h-4 mr-2' />
                    Send to
                </>
            }>
                {data.items?.map(item => <ContextMenuItem onItemClick={(category) => handleSendClick(category || item.category)} {...item} key={item.name} />)}
            </SubMenu>
            <MenuItem onClick={() => handleBlock(!isBlocked)}>{isBlocked ? <><TrashIcon className='text-green-400 w-4 h-4 mr-2' /> Unblock</> : <><TrashIcon className='text-red-400 w-4 h-4 mr-2' /> Block</>}</MenuItem>
        </ControlledMenu >
    )
}


export const SelectorMenu = (data: SelectorMenuProps) => {
    const [filter, setFilter] = useState('');
    return (
        <Menu menuButton={<MenuButton className={''}><Button>Choose</Button></MenuButton>}
            theming="dark"
            onMenuChange={e => e.open && setFilter('')}
            overflow={'visible'}
            position={'initial'}
            direction={'right'}
        >
            <FocusableItem>
                {({ ref }) => (
                    <input ref={ref} type="text" placeholder="Type to filter"
                        value={filter} onChange={e => setFilter(e.target.value)} />
                )}
            </FocusableItem>
            <MenuGroup style={{ maxHeight: 200, overflowY: 'auto' }} takeOverflow>
                {data.items?.sort((a, b) => (a.category || '')?.localeCompare(b.category || '')).filter((category) => category.category?.toUpperCase().includes(filter.trim().toUpperCase())).map((category) => (
                    <MenuItem key={category.name} onClick={() => data.onItemClick && data.onItemClick(category.category)}>{category.category}</MenuItem>
                ))}
            </MenuGroup>
        </Menu >
    )
}

export default ContextMenu