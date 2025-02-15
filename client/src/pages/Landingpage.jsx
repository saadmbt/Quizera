import React from 'react';
import Hero from '../components/landingpage/Hero';
import Howitworks from '../components/landingpage/Howitworks';
import Pricing from '../components/landingpage/Pricing';
import Features from '../components/landingpage/Features';
import FAQ from '../components/landingpage/FAQ';
import Whyus from '../components/landingpage/Whyus';
import Calltoaction from '../components/landingpage/Calltoaction';

const Landingpage = () => {
    return (<>
        <Hero/>
        <Howitworks/>
        <Pricing/>
        <Features/>
        <Whyus/>
        <FAQ/>
        <Calltoaction/>
      </>
      )
}

export default Landingpage;