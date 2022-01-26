import React from 'react';

interface Props{
    type?: string
}

const styleMap = new Map();

styleMap.set('new', 'bg-green-500 shadow-green-400 ring-green-700');
styleMap.set('secondNew', 'bg-yellow-500 shadow-yellow-400 ring-yellow-500');
styleMap.set(undefined, 'bg-gray-900 ring-gray-600');

export function Indicator({ type }: Props) {

    return <div className={`w-2 h-4 rounded-sm shadow-md ring-1 ${styleMap.get(type)}`}></div>;
}
