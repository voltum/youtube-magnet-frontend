import React, { Component, ReactElement } from 'react'
import { Link } from 'react-router-dom'
import { ChipIcon } from '@heroicons/react/outline'
import { useMatch } from 'react-router-dom';

interface Props{
    label: string,
    to: any,
    icon?: ReactElement<any,any>
    activeOnlyWhenExact?: boolean
}

function MenuItem({ label, to, icon, activeOnlyWhenExact }: Props) {
    let match = useMatch({
        path: to,
        exact: activeOnlyWhenExact ? activeOnlyWhenExact : true
    });
    return (
        <div className={`w-full flex items-center group hover:text-white ${match ? 'text-white' : 'text-gray-400'}`}>
            <span className={`flex items-center text-center group-hover:text-white w-6 h-6 mr-2 ${match ? 'text-emerald-400 group-hover:text-emerald-400': 'text-gray-400'}`}>{icon}</span><Link to={to} className='block w-full py-1 px-1.5 text-md'>{label}</Link>
        </div>
    )
}

export default MenuItem
