import React from 'react'
import Home from './routes/Home'
import { AuthProvider } from './components/Auth/AuthContext'
const App = () => {
  return (<>
    <AuthProvider>
      <Home/>
    </AuthProvider>
  </>
  )
}

export default App