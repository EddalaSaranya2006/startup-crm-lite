import React from 'react';

const productCard = ({ children }) => {
    return (
        <div className='w-60 h-60 bg-red-500 border rounded-lg p-4 flex flex-col gap-4'>
            {children}
        </div>
    );
}

export default productCard