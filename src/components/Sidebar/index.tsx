import React, { useState } from 'react'
import MenuHeader from './MenuHeader'
import MenuItem from './MenuItem'
import { ChartSquareBarIcon, ChipIcon, InformationCircleIcon, TableIcon } from '@heroicons/react/outline'
import Collections from '../../pages/Collections'

function Sidebar() {
    const [open, setOpen] = useState(true);

    function handleOpen() {
        setOpen(!open);
    }

    return (
        <div className={`fixed p-4 ${open ? 'w-48' : 'w-12'} text-white`}>
            <MenuHeader text='Navigation' />
            <MenuItem label='Dashboard' to={'/'} icon={<ChipIcon />} />
            <MenuItem label='Collections' to={'/collections'} icon={<TableIcon />} />
            <MenuItem label='Analytics & Log' to={'/analytics'} icon={<ChartSquareBarIcon />} />
            <MenuItem label='About' to={'/about'} icon={<InformationCircleIcon />} />
        </div>
    )
}

export default Sidebar
