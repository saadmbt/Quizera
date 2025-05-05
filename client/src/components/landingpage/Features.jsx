import React from 'react'
import { FileTextIcon, ZapIcon, UsersIcon } from 'lucide-react'
const Features = () => {
    const features = [
        {
          title: 'Create quizzes from any document',
          description:
            'Upload PDFs, Word documents, PowerPoint presentations, or even images, and our AI will generate relevant questions automatically.',
          icon: <FileTextIcon size={32} className="text-indigo-600" />,
          delay: '0',
        },
        {
          title: 'Instant quizzes',
          description:
            'No waiting - our advanced algorithms process your documents in seconds, creating comprehensive quizzes ready for immediate use.',
          icon: <ZapIcon size={32} className="text-indigo-600" />,
          delay: '100',
        },
        {
          title: 'Collaborate with others',
          description:
            'Share your quizzes with classmates, colleagues, or students. Work together to create the perfect assessment tool.',
          icon: <UsersIcon size={32} className="text-indigo-600" />,
          delay: '200',
        },
      ]
  return (<section className='bg-gradient-to-b from-[#FFFFFF] to-[#D2DCFF]' id='Features'>
<div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform offers everything you need to create, customize, and
            share quizzes efficiently.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay={feature.delay}
            >
              <div className="bg-indigo-50 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <button className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors duration-300">
                Try it now
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
  </section>
  )
}

export default Features