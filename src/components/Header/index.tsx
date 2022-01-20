import React from 'react'
import { ChipIcon } from '@heroicons/react/outline'

function Header() {
    return (
        <div className='fixed left-0 right-0 z-50 top-0 bg-white dark:bg-gray-900 px-6 py-5 ring-1 ring-gray-900/5 shadow-xl mb-4 text-white'>
            <div className='m-auto flex items-center'>
                <span className=''><ChipIcon className='w-6 h-6 mr-2 inline-block' />Youtube Magnet</span>
            </div>
        </div>
    )
}

export default Header
