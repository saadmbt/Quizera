// Desc: Constants for the website
// Date: 9th April 2021
// Version: 1.0.0
// Website Constants
// "dialog" and "Radio Group" and "textarea"from shadin/cn
import Multidoc from '../assets/whyusicons/multidoc.svg';
import Ieg from '../assets/whyusicons/Ieg.svg';
import Target from '../assets/whyusicons/Target.svg';
import ClockArrowUp from '../assets/whyusicons/clock-arrow-up.svg';
import BrainCog from '../assets/whyusicons/brain-cog.svg';
import Users from '../assets/whyusicons/users.svg';
import { BarChart, BookOpen, BrainCircuit, Crown, Library, Settings, UploadIcon } from 'lucide-react';
export const websiteConstants = {
    // Website URL
    WEBSITE_URL: 'https://PrepGenius.com',
    // Website Name
    WEBSITE_NAME: 'PrepGenius',
    // Website Description
    WEBSITE_DESCRIPTION: 'Create a Quiz instantly, with your own files!',
    // Website Keywords
    WEBSITE_KEYWORDS: 'quiz, exam, test, multiple choice, true or false, short answer, generate, create, document, pdf, word file, text file, image, presentation',
    // Website Author
    WEBSITE_AUTHOR: 'Mourabit Saad',
};
// Landing page Constants
// Navigation Links
export const navlinks = [
    {
        title: 'How it works',
        url: 'howitworks',
        external: false
    },
    {
        title: 'Features',
        url: 'Features',
        external: false
    },
    {
        title: 'Pricing',
        url: 'Pricing',
        external: false
    },
    {
        title: 'About', 
        url: '/about',
        external: true
    },
]
// Hero Text
export const herotext = {
    title: 'Create a Quiz instantly, with your own files!',
    subtitle: "Unlock your potential with our innovative exam maker. Whether you're a student gearing up for exams or a teacher designing assessments, our tool is your go-to solution. Effortlessly create professional multiple-choice, true or false, and short-answer exams in any subject and language.",
    upsub: 'Available in all the  Languages',
    cta: 'Create Your First Exam ',
    url: '/auth/login',
    lmbtn: 'Learn More',
}
export const herotext2 = {
    title: 'The Ultimate Quiz Generator From',
    variable: ['Document', 'PDF', 'Word', 'Text', 'Image', 'Presentation'],
    subtitle: "Create quizzes from any document, including PDFs, Word files, and more. Our tool automatically extracts text from your files and generates questions based on the content. Say goodbye to manual question creation and hello to instant quizzes!",
    cta: 'Create Your First Exam ',
    url: '/auth/login',
}
export const Usedby = {
    title: 'Educators, Students, and Professionals around the world',
}
export const howitworks = {
        title: 'How it works',
        Steps: ['  Upload your file', '  Generate your quiz', '  Test Your Knowledge', '  Share your quiz'],
    }
export const signupse = {
    title: 'Sign in and learn faster.',
    subtitle: ' Our platform is designed to help you learn more efficiently and effectively. Sign up today and start creating quizzes in minutes !',
    cta: 'Go study',
}
export const features = [
    {
        title: 'Create quizzes from any document',
        subtitle: 'Upload any document, including PDFs, Word files, and more, and our tool will automatically extract text and generate questions based on the content.',
        image: 'doc',
        cta: 'Try it now',
        Link: '/auth/login'
    },
    {
        title: 'Instant quizzes',
        subtitle: 'Effortlessly create professional multiple-choice, true or false, and short-answer exams in any subject and language.',
        image: 'flashcard',
        cta: 'Try it now',
        Link: '/auth/login'
    },
    {
        title: 'Collaborate with others',
        subtitle: 'Invite your friends, classmates, or colleagues to collaborate on quizzes and share knowledge.',
        image: 'shareq',
        cta: 'Try it now',
        Link: '/auth/login'
    },
]
export const pricingTiers = [
    {
        title: 'Free',
        subtitle: 'Get started with 5 exam generations.',
        price: '$0',
        features: [{text:'Create 5 Exam Generations',icon:"Check"},{text:'Share quizzes',icon:"Check"}, {text:'Access to All Features',icon:"X"},{text:'No Ads',icon:"X"},{text:'No Limit on Questions',icon:"X"} ],
        cta: 'Checkout Now',
    },
    {
        title: 'Standard',
        subtitle: 'Get started with 20 exam generations.',
        old_price: '$9.99',
        price: '$4.99',
        features: [{text:'Create 20 Exam Generations',icon:"Check"},{text:'Share quizzes',icon:"Check"},{text:'20 Questions per Quiz',icon:"Check"}, {text:'Access to All Features',icon:"X"},{text:'No Ads',icon:"X"} ],
        cta: 'Checkout Now',
    },
    {
        title: 'Lifetime',
        subtitle: 'Unlimited exam generations for life.',
        old_price: '$25.99',
        price: '$19.99',
        features: [{text:'Unlimited Exam Generations',icon:"Check"},{text:'Share quizzes',icon:"Check"},{text:'Access to All Features',icon:"Check"} ,{text:'No Ads',icon:"Check"},{text:'No Limit on Questions',icon:"Check"} ,{text:'Free Updates Forever',icon:"Check"} ],
        cta: 'Checkout Now',
        pp:true
    }
]
export const whyus = [
    {
        icon: Ieg,
        title: 'Instant Exam Generation',
        subtitle: "Whether you're a student gearing up for exams or a teacher designing assessments, our Multiple Choice Exam Maker is your go-to solution. Instantly create professional, multiple choice tests in any subject and language with ease",
    },
    {
        icon: Multidoc,
        title: 'Flexible Input Options',
        subtitle: "Create multiple-choice, true or false, and short-answer exams from text, PDFs, and images. Our Exam Maker effortlessly handles all formats.",
    },
    {
        icon: Users,
        title: 'Collaboration Made Easy',
        subtitle: "Invite your friends, classmates, or colleagues to collaborate on quizzes and share knowledge. Our platform is designed to help you learn more efficiently and effectively.",
    },
    {
        icon: Target ,
        title: 'Accurate Questions',
        subtitle: "Our  Exam Maker crafts relevant, challenging questions that truly test your understanding of the material.",
    },
    {
        icon: ClockArrowUp,
        title: 'Save Time',
        subtitle: "Stop spending heures creating multiple choice tests manually. Our exam maker does the work for you in seconds.",
    },
    {
        icon: BrainCog,
        title: 'Study Smarter',
        subtitle: "Practice with auto-generated multiple-choice, true or false, and short-answer questions to boost retention and test readiness.",
    }
]
export const about = [
    {
        title: 'Our Mission',
        subtitle: 'Our mission is to help students, teachers, and professionals around the world learn more efficiently and effectively. Our innovative exam maker is designed to make studying easier and more enjoyable.',
    },
    {
        title: 'Our Team',
        subtitle: 'Our team is made up of passionate educators, developers, and designers who are dedicated to creating the best possible learning experience for our users. We are constantly working to improve our platform and add new features.',
    },
    {
        title: 'Our Story',
        subtitle: 'Our story began with a simple idea: to make studying easier and more enjoyable. We started with a small team of developers and designers and have since grown into a global company with millions of users worldwide.',
    },
    {
        title: 'Our Values',
        subtitle: 'We value innovation, collaboration, and customer satisfaction above all else. We are committed to creating the best possible learning experience for our users and are always looking for ways to improve our platform.',
    }
]
export const faqs = [
    {
        question: 'What is PrepGenius ?',
        answer: 'PrepGenius is a tool that allows you to create multiple-choice, true or false, and short-answer exams in any subject and language. You can upload any document, including PDFs, Word files, and more, and our tool will automatically extract text and generate questions based on the content.',
    },
    {
        question: 'How do I use PrepGenius ?',
        answer: 'To use PrepGenius, simply upload your document, select the type of questions you want to generate, and click "Create Quiz." Our tool will automatically extract text from your document and generate questions based on the content. You can then edit the questions as needed and share your quiz with others.',
    },
    {
        question: 'Is PrepGenius suitable for all types of exams?',
        answer: 'Yes, PrepGenius is suitable for all types of exams, including multiple-choice, true or false, and short-answer tests. You can create quizzes in any subject and language and customize the questions to suit your needs.',
    },
    {
        question: 'Can I save or share the generated tests?',
        answer: 'Yes, you can save and share the generated tests with others. You can download the quizzes as PDFs or share them via email, social media, or other platforms. You can also collaborate with others on quizzes and share knowledge.',
    },
    {
        question: 'Is PrepGenius free?',
        answer: 'PrepGenius offers a free trial, and then it is a subscription-based service. You can choose from a free plan, a standard plan, or a lifetime plan, depending on your needs. Each plan offers different features and benefits.',
    }
]
// contact us  Constants
export const contact = {
    title: 'Contact Us',
    subtitle: 'Have a question or feedback? We would love to hear from you! Fill out the form below, and we will get back to you as soon as possible.',
    cta: 'Contact Us',
    url: '/contact',
}
// Footer Constants
export const footerlinks = [
    {
        title: 'How it works',
        url: 'howitworks',
        external: false
    },
    {
        title: 'Features',
        url: 'Features',
        external: false
    },
    {
        title: 'Pricing',
        url: 'Pricing',
        external: false
    },
    {
        title: 'FAQs',
        link: 'FAQ',
        external: false
    },
    {
        title: 'Contact',
        link: '/Contact',
        external: true
    },
]
// End Landing page Constants

export const navigationItems = [
    { icon: <BookOpen />, label: 'Dashboard', id: 'dashboard' },
    { icon: <UploadIcon />, label: 'Upload', id: 'upload' },
    { icon: <Library />, label: 'Flashcards', id: 'flashcards' },
    { icon: <BrainCircuit />, label: 'Quizzes', id: 'quizzes' },
    { icon: <BarChart />, label: 'Analytics', id: 'analytics' },
    { icon: <Settings />, label: 'Settings', id: 'settings' }
  ];
export const stats = [
    { title: 'Completed Lessons', value: '24', color: 'bg-blue-500', icon: BookOpen },
    { title: 'Average Score', value: '92%', color: 'bg-green-500', icon: BrainCircuit },
    { title: 'Study Streak', value: '7 days', color: 'bg-orange-500', icon: Crown }
  ];
