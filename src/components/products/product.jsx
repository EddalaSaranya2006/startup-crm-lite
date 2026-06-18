import React from 'react'
import ProductCard from './productCard'
import Button from './button'
import PageContainer from '../layout/PageContainer'

const Product = () => {
    return (
        <PageContainer className='py-10'>
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
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
        </PageContainer>
    )
}

export default Product
