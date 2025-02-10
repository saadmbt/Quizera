import React from 'react'
import { faqs } from '../../constants'
import {Accordion, AccordionItem} from "@heroui/accordion";
const FAQ = () => {
  return (<section className='bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF]' id='FAQ'>
    <div className="container lg-centered py-10 px-4">
        <div className="flex flex-col items-center gap-4 mb-4 max-w-[540px] mx-auto">
            <h2 className="section-title md:text-[35px] mt-2">Frequently Asked Questions</h2>
        </div>
        <div className='my-5 max-w-[500px] mx-auto'>
        <Accordion variant="splitted" >
            {faqs.map((faq,i)=>{
                return <AccordionItem key={i} aria-label={faq.question} title={faq.question} >{faq.answer}</AccordionItem>
            })}
        </Accordion>
    </div>
    </div>
  </section>
  )
}

export default FAQ