export const fadeIn=(direction,delay)=>{
    return {
        hidden:{
            opacity:0,
            y:direction === 'up' ? 40 :direction === 'down'? -40 : 0,
            x:direction === 'left' ? 40 :direction === 'right'? -40 : 0,
        },
        show:{
            opacity:1,
            x:0,
            y:0,
            transition:{
                duration:1,
                delay:delay,
                type:"tween",
                ease:[0.25,0.25,0.25,0.75]
            }
        }
    }

}
// Light and dark variants
// "bg-white dark:bg-gray-800"  // Background colors
// "text-gray-600 dark:text-gray-400"  // Text colors
// "border-gray-200 dark:border-gray-700"  // Border colors
// "hover:bg-gray-100 dark:hover:bg-gray-700"  // Hover states
