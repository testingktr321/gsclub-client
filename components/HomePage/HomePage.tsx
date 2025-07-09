import React from 'react'
import Hero from './Hero'
import Products from './Products'
import Filter from './Filter'
import Faq from './Faq'

const HomePage = () => {
    return (
        <main>
            <Hero />
            <Filter />
            <Products />
            <Faq />
        </main>
    )
}

export default HomePage
