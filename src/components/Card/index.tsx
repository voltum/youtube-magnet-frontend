import React from 'react'
import { BeakerIcon } from '@heroicons/react/solid'

interface Props {
    className?: string,
    secondBorder?: string,
    children: any
}

const Card = (props: Props) => {
    return (
        <div className={`${props.className || ''} ${props.secondBorder ? `border-2 border-${props.secondBorder}-400` : ''} px-4 py-3 mb-4 relative box-border before:absolute before:top-0 before:bottom-0 before:border-y after:absolute after:left-0 after:right-0 after:border-x before:border-gray-500 after:border-gray-500 before:left-5 before:right-5 after:top-5 after:bottom-5`}>
            <div className='z-10 relative'>
                {props.children}
            </div>
            <div className='absolute top-0 right-0 bottom-0 left-0'>
                <div className='before:absolute after:absolute before:top-0 before:left-0 after:top-0 after:left-0 before:w-1 before:h-3 before:bg-gray-500 after:w-3 after:h-1 after:bg-gray-500'></div>
                <div className='before:absolute after:absolute before:top-0 before:right-0 after:top-0 after:right-0 before:w-1 before:h-3 before:bg-gray-500 after:w-3 after:h-1 after:bg-gray-500'></div>
                <div className='before:absolute after:absolute before:bottom-0 before:left-0 after:bottom-0 after:left-0 before:w-1 before:h-3 before:bg-gray-500 after:w-3 after:h-1 after:bg-gray-500'></div>
                <div className='before:absolute after:absolute before:bottom-0 before:right-0 after:bottom-0 after:right-0 before:w-1 before:h-3 before:bg-gray-500 after:w-3 after:h-1 after:bg-gray-500'></div>
            </div>
        </div>
    )
}

export default Card;
