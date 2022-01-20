import React from 'react'

interface Props{
    text: string
}

function MenuHeader(props: Props) {
    return (
        <span className='block mb-2 text-xs text-gray-400 font-bold'>{props.text}</span>
    )
}

export default MenuHeader
