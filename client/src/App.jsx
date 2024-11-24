import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
// import './App.css'

function App() {
  const [Loader, setLoader] = useState(false)
  const [response, setresponse] = useState("")
  const [file,setfile]=useState(null)
  const  handlesubmition= async(e)=>{
    e.preventDefault()
    setLoader(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await axios.post('http://localhost:5000/upload', formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } });
      setresponse(response.data)
    } catch (error) {
       console.error(error)
      }finally{

      }
     
  }

  return (
    <>
      <form onSubmit={handlesubmition} className='flex flex-row justify-center align-bottom mt-12'>
          <label className='flex flex-col  mt-36'>
            Select file to upload:
           <input type="file" name="file" onChange={(e)=>setfile(e.target.files[0])} />    
          </label>
      </form>
    </>
  )
}

export default App
