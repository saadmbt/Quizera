import React from 'react'
import { UploadCloudIcon, WandIcon, BrainIcon, ShareIcon } from 'lucide-react'
import Subhero from './Subhero'

const Howitworks = () => {
  const steps = [
    {
      title: 'Upload your file',
      description:
        'Simply drag and drop your document, or select it from your device.',
      icon: <UploadCloudIcon size={32} className="text-white" />,
    },
    {
      title: 'Generate your quiz',
      description:
        'Our AI analyzes your content and creates relevant questions automatically.',
      icon: <WandIcon size={32} className="text-white" />,
    },
    {
      title: 'Test Your Knowledge',
      description:
        'Take the quiz yourself or assign it to others to gauge understanding.',
      icon: <BrainIcon size={32} className="text-white" />,
    },
    {
      title: 'Share your quiz',
      description:
        'Distribute your quiz via link, email, or embed it on your website.',
      icon: <ShareIcon size={32} className="text-white" />,
    },
  ]
  return (
    <section className='py-14 px-4 bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF]' id='howitworks'>
        <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How PrepGenius Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Creating quizzes has never been easier. Follow these simple steps to
            get started.
          </p>
        </div>
        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-indigo-200 transform -translate-y-1/2 z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-blue-500 rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-3">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 pt-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
        <Subhero/>
    </section>
  )
}

export default Howitworks