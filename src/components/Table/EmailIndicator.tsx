import React from 'react';

interface Props{
    type?: string
}

const styleMap = new Map();

styleMap.set(true, 'bg-green-500 shadow-green-400 ring-green-700');
styleMap.set(false, 'bg-yellow-500 shadow-yellow-400 ring-yellow-500');
styleMap.set(undefined, 'bg-gray-900 ring-gray-600');

export function EmailIndicator({ type }: Props) {
    return <div className={`w-2 h-2 rounded-xl shadow-md ring-1 ${styleMap.get(type) }`}></div>;
}
