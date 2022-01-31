import { GlobeAltIcon } from '@heroicons/react/outline';
import moment from 'moment';
import React from 'react';
import { Channel } from '../../utils/channels';

interface Props{
    data: Channel
}

function StatCell(props: any){
    return <div className='p-2 rounded-md ring-1 ring-slate-400'>
        {props.children}
    </div>
}

function ChannelInfo({ data }: Props) {
    if(!data) return <>No channel data</>;

    const { title, url, description, folder, email, subscriberCount, videoCount, viewCount, lastVideoPublishedAt, socialLinks: socialLinksJSON, createdAt, updatedAt } = data;

    const socialLinks = (JSON.parse(socialLinksJSON) as any[])?.filter((link) => {
        if(!link) return false;
        return true;
    }) || [];


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
                        const url = new URL(link);
                        return <li key={link}><a href={url.href} className='underline underline-offset-2'>{url.hostname + url.pathname}</a></li>
                    })}
                </ul>
            </>
             : <span className='uppercase text-sm text-yellow-400'>No social links found</span>}
        </div>
        
        {/* Meta */}
        <ul className='mt-4'>
            {createdAt && <li>Added to database: {moment(new Date(createdAt)).fromNow()}</li>}
            {updatedAt && <li>Last update: {moment(new Date(updatedAt)).fromNow()}</li>}
        </ul>
        
    </div>;
}

export default ChannelInfo;
