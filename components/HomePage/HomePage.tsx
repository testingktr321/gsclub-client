import React from 'react'
import Hero from './Hero'
// import Products from './Products'
// import Filter from './Filter'
import Faq from './Faq'
import ProductTypes from './ProductTypes'
import GetMail from './GetMail'
import SupplementsBanner from './SupplementsBanner'
import AdultGoods from './AdultGoods'
import ProductList from './ProductList'

const HomePage = () => {
    return (
        <main>
            <Hero />
            <ProductTypes />
            <ProductList title="Just In" viewAllLink="/vapes" productType="VAPES" />
            <GetMail />
            <AdultGoods />
            <ProductList title="Can’t miss" viewAllLink="/vapes" productType="VAPES" />
            {/* <Filter /> */}
            {/* <Products /> */}
            <SupplementsBanner />
            <Faq />
        </main>
    )
}

export default HomePage
