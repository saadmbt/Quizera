import React from 'react'
import Home from './routes/Home'
import { AuthProvider } from './components/Auth/AuthContext'
import { BrowserRouter } from 'react-router-dom'
const App = () => {
  return (<>
    <AuthProvider>
      <BrowserRouter>
      <Home/>
      </BrowserRouter>
      
    </AuthProvider>
  </>
  )
}

export default App