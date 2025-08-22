"use client"
import React from 'react'
import Hero from './Hero'
import Products from '../HomePage/Products'
import Filter from '../HomePage/Filter'

const VapePage = () => {
    return (
        <main>
            <Hero />
            <div className='pt-5'>
                <Filter /> 
                <Products productType="VAPES" />
            </div>
        </main>
    )
}

export default VapePage