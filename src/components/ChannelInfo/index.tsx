import { GlobeAltIcon } from '@heroicons/react/outline';
import moment from 'moment';
import React from 'react';
import toast from 'react-hot-toast';
import { Channel, updateChannel } from '../../utils/channels';
import { useQuery } from '../../utils/common';
import { Indicator } from '../Table';
import { EmailIndicator } from '../Table/EmailIndicator';

interface Props {
    data: Channel | undefined
}

function StatCell(props: any) {
    return <div className='p-2 rounded-md ring-1 ring-slate-400'>
        {props.children}
    </div>
}

function ChannelInfo({ data }: Props) {
    let query = useQuery();

    if (!data) return <>No channel data</>;

    const { _id, title, url, description, folders, globalNote, email, subscriberCount, videoCount, viewCount, lastVideoPublishedAt, socialLinks: socialLinksJSON, createdAt, updatedAt } = data;

    const socialLinks = (JSON.parse(socialLinksJSON) as any[])?.filter((link) => {
        if (!link) return false;
        return true;
    }) || [];

    const updateGlobalNote = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const currentFolder = query.get('folder');
        const value = e.currentTarget.value;

        if (!e.shiftKey && e.key === 'Enter') {
            e.preventDefault();
            if (currentFolder) {
                updateChannel(_id, { globalNote: value })
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
    }

    return <div className='whitespace-pre-line'>

        {/* Stat */}
        <div className='mb-4 grid gap-3 grid-cols-2 grid-rows-2'>
            <StatCell>{subscriberCount ? <>{subscriberCount.toLocaleString()} subscribers</> : <span className='text-yellow-400 text-sm uppercase'>Count hidden</span>}</StatCell>
            <StatCell>{videoCount && <>{videoCount.toLocaleString()} videos</>}</StatCell>
            <StatCell>{viewCount && <>{viewCount.toLocaleString()} views</>}</StatCell>
            <StatCell>Last video: {moment(lastVideoPublishedAt).fromNow()}</StatCell>
        </div>

        {/* Title */}
        <a href={url || ''} >{title ? <div className='text-lg mb-3 underline underline-offset-2'>{title}</div> : <span className='text-yellow-400'>No title</span>}</a>

        {/* Email */}
        <div className={`mb-4 py-2 px-4 border-l-2 border-l-${email ? 'lime' : 'yellow'}-400`}>
            {email ? <div className=''>{email}</div> : <span className='uppercase text-sm text-yellow-400'>No email specified</span>}
        </div>

        {/* Description */}
        <div className={`mb-4 py-2 px-4 border-l-2 border-l-${description ? 'slate' : 'yellow'}-400`}>
            {description ? <p>{description.trim()}</p> : <span className='uppercase text-sm text-yellow-400'>No description</span>}
        </div>

        {/* Social links */}
        <div className={`mb-4 py-2 px-4 border-l-2 border-l-${socialLinks.length ? 'teal' : 'yellow'}-400`}>
            {socialLinks.length ?
                <>
                    <span><GlobeAltIcon className='w-5 h-5 inline' /> Social links:</span>
                    <ul className='mt-4 list-decimal list-inside'>
                        {socialLinks.map((link: string) => {
                            let url: URL;
                            try {
                                url = new URL(link);
                            } catch (error) {
                                url = new URL('');
                            }
                            return <li key={link}><a href={url.href} className='underline underline-offset-2'>{url.hostname + url.pathname}</a></li>
                        })}
                    </ul>
                </>
                : <span className='uppercase text-sm text-yellow-400'>No social links found</span>}
        </div>

        <div className='grid grid-cols-2'>
            {folders.map((folder) =>
                <>
                    <div key={folder.name}>
                        <span className='mr-2'><EmailIndicator type={folder.blocked ? false : true} /></span> {folder.name}
                    </div>
                    <div key={folder.name + 'note'}>
                        <textarea className='h-8' value={folder.note} disabled />
                    </div>
                </>
            )}
        </div>

        {/* Meta */}
        <ul className='mt-4'>
            {createdAt && <li>Added to database: {moment(new Date(createdAt)).fromNow()}</li>}
            {updatedAt && <li>Last update: {moment(new Date(updatedAt)).fromNow()}</li>}
        </ul>

        <textarea className='mt-8 w-full' defaultValue={globalNote} onKeyDown={updateGlobalNote} />

    </div>;
}

export default ChannelInfo;
