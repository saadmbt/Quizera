import React from 'react'
import Navbar from './components/landingpage/navbar'
import Hero from './components/landingpage/Hero'
import Subhero from './components/landingpage/Subhero'
import Howitworks from './components/landingpage/howitworks'
import Pricing from './components/landingpage/Pricing'
import Features from './components/landingpage/Features'
import FAQ from './components/landingpage/FAQ'
import Whyus from './components/landingpage/Whyus'
import Calltoaction from './components/landingpage/Calltoaction'
import Footer from './components/landingpage/Footer'
const App = () => {
  return (<>
    <Navbar/>
    <Hero/>
    <Howitworks/>
    <Pricing/>
    <Features/>
    <Whyus/>
    <FAQ/>
    <Calltoaction/>
    <Footer/>
  </>
  )
}

export default App