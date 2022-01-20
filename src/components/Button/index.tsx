import React, { MouseEventHandler } from 'react'

interface Props{
    children: React.ReactNode
    onClick?: MouseEventHandler
}

function Button(props: Props) {
    return (
        <div className='inline-block py-1 px-3 cursor-pointer bg-slate-500 hover:bg-slate-600 active:bg-slate-700' onClick={props.onClick}>
            {props.children}
        </div>
    )
}

export default Button
