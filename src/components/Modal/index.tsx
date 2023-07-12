import React, { ReactNode, useEffect, useRef } from 'react'
import { XIcon } from '@heroicons/react/outline'
import Table from '../Table';
import { Column } from 'react-table';
import Button from '../Button';

interface Props {
    visible?: boolean
    onCancel: () => void
    header?: ReactNode
    footer?: ReactNode
    children: ReactNode
}

function Modal({ visible, onCancel, header = "Modal", footer, children }: Props) {

    return (
        <div className='flex absolute w-full h-full items-center justify-center z-50 pt-16'>
            <div className='relative w-full max-w-xl rounded-md bg-slate-800 ring-1 ring-slate-700'>
                <div onClick={onCancel}>
                    <button className='absolute w-10 h-10 p-2 right-0 top-0 rounded-tr-md' ><XIcon className='text-slate-400' /></button>
                </div>
                <div className='border-b-2 border-slate-600 px-12 py-3 mb-4'>
                    {header}
                </div>
                <div className='px-12'>
                    {children}
                </div>
                <div className='flex gap-2 justify-end border-t-2 border-slate-600 px-4 py-2 mt-6'>
                    {footer && footer}
                    <Button onClick={onCancel}>Close</Button>
                </div>
            </div>
        </div>
    )
}

export default Modal
