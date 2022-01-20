import React, { ReactNode, useEffect, useRef } from 'react'
import { XIcon } from '@heroicons/react/outline'
import Table from '../Table';
import { Column } from 'react-table';
import Button from '../Button';

interface Props{
    visible: boolean
    onCancel: Function
    header?: Function
    footer?: Function
    children: ReactNode
}

function Modal({visible, onCancel, header, footer, children}: Props) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(visible) 
        {
            document.body.style.overflow = 'hidden';
            // document.body.style.paddingRight = '15px';
        }

        if(container.current) container.current.onclick = (e) => {
            if(container.current === e.target){
                onCancel();
            }
        };

        return () => {
            document.body.style.overflow = 'auto';
            // document.body.style.paddingRight = '0';
        }
    }, [visible])

    return (
        <div className={`${visible?'visible':'invisible'} fixed top-0 right-0 bottom-0 left-0 backdrop-blur-sm z-50 before:fixed before:top-0 before:right-0 before:bottom-0 before:left-0 before:bg-black before:opacity-50`}>
            <div ref={container} className='flex absolute w-full h-full items-center justify-center z-50'>
                <div className='relative w-full max-w-lg rounded-md bg-slate-800 ring-1 ring-slate-700'>
                    <div onClick={()=>onCancel()}>
                        <button className='absolute w-10 h-10 p-2 right-0 top-0 rounded-tr-md' ><XIcon className='text-slate-400' /></button>
                    </div>
                    <div className='border-b-2 border-slate-600 px-12 py-3 mb-4'>
                        {header && header()}
                    </div>
                    <div className='px-12'>
                        {children}
                    </div>
                    <div className='flex gap-2 justify-end border-t-2 border-slate-600 px-4 py-2 mt-6'>
                        {footer && footer()}
                        {onCancel && <Button onClick={()=>onCancel()}>Close</Button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
