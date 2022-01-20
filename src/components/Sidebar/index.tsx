import React from 'react'
import MenuHeader from './MenuHeader'
import MenuItem from './MenuItem'
import { ChartSquareBarIcon, ChipIcon, InformationCircleIcon, TableIcon } from '@heroicons/react/outline'
import Collections from '../../pages/Collections'

function Sidebar() {
    return (
        <div className='fixed p-4 w-64 text-white'>
            <MenuHeader text='Navigation' />
            <MenuItem label='Dashboard' to={'/'} icon={<ChipIcon />}/>
            <MenuItem label='Collections' to={'/collections'} icon={<TableIcon />} />
            <MenuItem label='Analytics' to={'/analytics'} icon={<ChartSquareBarIcon />} />
            <MenuItem label='About' to={'/about'} icon={<InformationCircleIcon />} />
        </div>
    )
}

export default Sidebar
