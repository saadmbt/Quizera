import React from 'react'
import Navbar from './components/landingpage/navbar'
import Hero from './components/landingpage/Hero'
import Subhero from './components/landingpage/Subhero'
import Howitworks from './components/landingpage/howitworks'
import Pricing from './components/landingpage/Pricing'
import Features from './components/landingpage/Features'
import FAQ from './components/landingpage/FAQ'
import Whyus from './components/landingpage/Whyus'
const App = () => {
  return (<>
    <Navbar/>
    <Hero/>
    <Subhero/>
    <Howitworks/>
    <Pricing/>
    <Features/>
    <FAQ/>
    <Whyus/>
  </>
  )
}

export default App