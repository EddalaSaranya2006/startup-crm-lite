import React from 'react';

const productCard = ({ children }) => {
    return (
        <div className='w-full max-w-60 min-h-60 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-4 text-gray-900 dark:text-white shadow-xs dark:shadow-none'>
            {children}
        </div>
    );
}

export default productCard
