import { Link } from "react-router-dom"
import { TriangleAlert } from 'lucide-react'
export default function NotFoundpage(){
    return (
        <section className=" lg-centered text-center flex flex-col justify-center items-center h-screen">
        <TriangleAlert className=" text-red-600 w-[80px] h-[80px] md:w-[100px] md:h-[100px] lg:w-[150px] lg:h-[150px] mb-4"/>
        <h1 className="text-2xl md:text-4xl lg:text-4xl font-bold mb-4">404 Not Found</h1>
        <p className="text-medium md:text-lg lg:text-xl mb-5">This page does not exist</p>
        <Link
          to="/"
          className="btn btn-primary px-10 py-2 mt-4 "
          >Go Back</Link>
      </section>
  
    )
}