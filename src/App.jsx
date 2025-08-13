// import { useState } from 'react'
import './App.css'

import AppRoutes from './routes/AppRoutes'
import { ContextProvider } from './Context';

function App() {

  return(
    <>
    <ContextProvider>
      <AppRoutes />
    </ContextProvider>
    </>
  )

}

export default App
