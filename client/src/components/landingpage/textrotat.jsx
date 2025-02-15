import React ,{useState,useEffect} from "react"
import { AnimatePresence, motion } from "framer-motion"
 //     {
//   text = "Rotate",
//   words = ["Word 1", "Word 2", "Word 3"],
// }: {
//   text: string
//   words: string[]
// }
export function RotateWords({ text, words }) {
  const [index, setIndex] = useState(0)
 
useEffect(() => {
const interval = setInterval(() => {
setIndex((prevIndex) => (prevIndex + 1) % words.length)
}, 5000)
// Clean up interval on unmount
return () => clearInterval(interval)
}, [])
return (
 
<div className="text-medium text-center sm:text-sm font-bold tracking-tight md:text-2xl md:leading-[4rem] w-fit flex items-center jusitfy-center mx-auto gap-1.5">
  {text}{' '}
  <AnimatePresence mode="wait">
    <motion.p
      key={words[index]}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.5 }}
      className='bg-gradient-to-b from-black to-[#1884FF] text-transparent bg-clip-text '
    >
      {words[index]}
    </motion.p>
  </AnimatePresence>
</div>
) }