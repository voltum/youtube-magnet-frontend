import React from 'react';

export default function Tabs() {
  return <div></div>;
}

const TabSelector = ({
  isActive,
  children,
  onClick,
}: {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    className={`mr-8 mb-4 group inline-flex items-center px-2 py-2 border-b-2 font-medium text-sm leading-5 cursor-pointer whitespace-nowrap ${
      isActive
        ? 'border-white-500 text-white-600 focus:outline-none focus:text-white-800 focus:border-white-700'
        : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300 focus:text-gray-600 focus:border-gray-300'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export { TabSelector }