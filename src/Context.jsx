

import axios from 'axios';
import { useState, createContext, useRef } from 'react'
import { io } from 'socket.io-client';
// import { liveQuery } from 'dexie';

// import { chatsDB } from './pages/chatui/MessageHandler';

const Context = createContext();

const SERVER_IP = 
window.location.hostname === 'localhost'
? 'http://localhost:3000'
: 'https://sh-chat.onrender.com';

let socket = null;
try {
  if(axios.get(SERVER_IP+'/status')) {
    socket = io(SERVER_IP,
      {withCredentials: true}
    );
  }
} catch (err) {
  console.log('server offline', err)
}



//observables
// const messageStream = liveQuery(()=> {
//   return chatsDB
//   .messages.toCollection()
//   .sortBy('timestamp')
// });

// const outboundMessageStream = liveQuery(()=> {
//   return chatsDB.messages
//     .where('sendPending')
//     .equals(1)
//     .sortBy('timestamp')
// });

const ContextProvider = ({children})=> {



  
  //state vars
  const [selectedChat, setSelectedChat] = useState(null)
  const [chatData, setChatData] = useState([])
  const [chatScreenMode, setChatScreenMode] = useState('contacts')
  const [chatList, setChatList] = useState([]);


  //refs
  let chatMap = useRef(new Map())


  return(
    <Context.Provider value={{SERVER_IP, selectedChat, setSelectedChat, chatData, setChatData, chatMap, socket, chatScreenMode, setChatScreenMode, chatList, setChatList}}>
      {children}
    </Context.Provider>
  )
}

export { ContextProvider, Context }