import React from 'react'
import ProductCard from './productCard'
import Button from './button'

const Product = () => {
    return (
        <div className='grid grid-cols-4 gap-4 my-10 px-10'>
            {/* <ProductCard name='Product 1' price='100' />
            <ProductCard name='Product 2' price='200' />
            <ProductCard name='Product 3' price='300' />
            <ProductCard name='Product 4' price='400' /> */}
            <ProductCard>
                <h2>Product 1</h2>
                <p>100</p>
                <Button text="Buy" />
                <Button text="Add to Cart" />
            </ProductCard>
        </div>
    )
}

export default Product