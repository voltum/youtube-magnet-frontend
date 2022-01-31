import React, { MouseEventHandler } from 'react'

interface Props{
    children: React.ReactNode
    onClick?: MouseEventHandler
    type?: 'danger'
}

const styleMap = new Map();

styleMap.set('danger', 'bg-red-600 hover:bg-red-700 active:bg-red-800');
styleMap.set(undefined, 'bg-slate-500 hover:bg-slate-600 active:bg-slate-700');

function Button(props: Props) {
    return (
        <div className={`inline-block py-1 px-3 cursor-pointer ${styleMap.get(props.type)}`} onClick={props.onClick}>
            {props.children}
        </div>
    )
}

export default Button
