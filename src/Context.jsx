

import { useState, createContext } from 'react'

const Context = createContext();

const ContextProvider = ({children})=> {

  const SERVER_IP = 
  window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://sh-chat.onrender.com';
  //state vars

  return(
    <Context.Provider value={{SERVER_IP}}>
      {children}
    </Context.Provider>
  )
}

export { ContextProvider, Context }