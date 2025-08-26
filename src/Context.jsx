

import axios from 'axios';
import { useState, createContext, useRef, useEffect } from 'react'
import { io } from 'socket.io-client';
import { Dexie, liveQuery } from 'dexie';

import { chatsDB, SelectAndLoadMessages, sendMessage, syncChats } from './utils/utils';
import { useNavigate } from 'react-router-dom';
const Context = createContext();

const SERVER_IP = 
window.location.hostname.startsWith('192.168')
? 'http://192.168.60.94:3000'
: 'https://sh-chat.onrender.com';

// const SERVER_IP = 'http://192.168.125.94:3000'

let socket = null;
try {
  if(axios.get(SERVER_IP+'/chat-room')) {
    socket = io(SERVER_IP,
      {withCredentials: true}
    );
  }
} catch (err) {
  console.log('server offline', err)
}



//observables
const messageStream = liveQuery(()=> {
  return chatsDB
  .messages.toCollection()
  .sortBy('timestamp')
});

const outboundMessageStream = liveQuery(()=> {
  return chatsDB.messages
    .where('sendPending')
    .equals(1)
    .sortBy('timestamp')
});



const ContextProvider = ({children})=> {

  const navigate = useNavigate()



  
  //state vars
  const [selectedChat, setSelectedChat] = useState(null)
  const [chatData, setChatData] = useState([])
  const [chatScreenMode, setChatScreenMode] = useState('messaging')
  const [chatList, setChatList] = useState([]);
  const [newMessages, setNewMessages] = useState(null)
  const [newOutboundMessages, setNewOutboundMessages] = useState(null)

  //settings stuff
  const profileTemplate = {
    uemail: localStorage.getItem('uemail'),
    nickname: localStorage.getItem('uemail')?.split('@')[0],
    profilePicURL: ""
  }
  const [profileData, setProfileData] = useState(profileTemplate)
  // const [chatsDB, setChatsDB] = useState(null)


  //refs
  let chatMap = useRef(new Map())

  let CLRef = useRef(null)
  let CSRef = useRef(null)

  // let userIdRef = useRef(null)


//test
// setChatData(SelectAndLoadMessages(selectedChat,chatsDB))


// useEffect(()=> {
//   // IIFC
// (async()=>{
//   const user = await axios.get(`${SERVER_IP}/profile`,{withCredentials: true})
// userIdRef.current = user?.data.profile.uid;
// console.log('UID',userIdRef.current, user)
// if(userIdRef.current) {
// // CUI
//   const newChatsDB = new Dexie(userIdRef.current);
//   setChatsDB(newChatsDB);
// }
// else {
//   const chatsDBFromLS = new Dexie(localStorage.getItem('uid'))
//   setChatsDB(chatsDBFromLS)
// }

// chatsDB.version(1).stores({
//   chats:
//     `&chatId,
//     chatName,
//     members,
//     admin,
//     mods,
//     tags,
//     type`,
//   messages:
//     `chatId,
//     sender,
//     timestamp,
//     content,
//     sendPending,
//     &s_uid,
//     reactions, 
//     replyTo,
//     forwardedFrom,
//     edited,
//     delivered,
//     seen`, // reaction:[{uemail,'emoji'},...], //replyTo: s_uid
//   contacts:
//     `&uemail,
//     nickname,
//     blocked,
//     faved`
// });

// })()
// },[])


useEffect(()=> {
  console.log('chatui::UE::openlog:isLoggedIn',localStorage.getItem('isLoggedIn'));

  // IIFC
  (async()=> {
    try {
    const res = await axios.get(SERVER_IP+'/profile',
      {withCredentials: true});
      if(!res.data.code || localStorage.getItem('isLoggedIn') === 'false') {
        navigate('/sh-chat-fe/login')
      }
      else if(res.data.profile.uid !== localStorage.getItem('uid')) {
        localStorage.setItem('uid',res.data.profile.uid);
        if(!sessionStorage.getItem('reloadOnce')) {
        window.location.reload();
        }
        sessionStorage.setItem("reloadOnce",'true')
      }      
    } catch {
      navigate('/sh-chat-fe/login')
      console.log('un-authed');
    }
  })()

  socket?.on('connection',()=> {

  }); // may have to reconnect

  socket?.on('messagesToClient',(incomingMessages)=> {
    try {
    console.log('imes:', typeof incomingMessages, incomingMessages);
    incomingMessages?.forEach(async message => {
      const exists = await chatsDB.messages.get(message.s_uid);
      if (!exists) {
        message.read = false;
        chatsDB.messages.add(message)
      }
      console.log('uid',chatsDB.messages.where('s_uid').equals(message.s_uid).toArray())
    })
    console.log('messages fetched and saved in IDB. Fin mes:', incomingMessages[-1] || []);
    }
    catch (err) {
      console.error('error in fetching/saving to IDB', err);
    }
  })
  socket.on('messagesToServerS',async (incomingSuid)=> {
    console.log('#3',incomingSuid)
    const {temp_uid, s_uid} = incomingSuid;
    console.log('#4',temp_uid, typeof temp_uid, s_uid)
    await chatsDB.messages.where("temp_uid").equals(temp_uid).modify({s_uid:s_uid})
  })

  // subs
  const messageSub = messageStream.subscribe(messages => {
    // trigger renders, add notifs - no, just make a map
  });
  const outboundSub = outboundMessageStream.subscribe( {
    next: messages => {
      // setNewOutboundMessages(messages); // update ui with useEffect
      sendMessage(socket, chatsDB, messages)
    },
    error: err => {
      console.log('debug::#98::', err)
    }
  });

  // IIFC
  (async()=> {
    let chats = await chatsDB.chats.toArray();
    setChatList(chats)
    chats = await syncChats(SERVER_IP, chatsDB)
    setChatList(chats);
    console.log('SyncChats::ahole::')
    // chatMap.current = await chatsDB.chats.toArray();
  })()


  // console.log(typeof chatList, chatList)
  return ()=> {
    socket?.disconnect();
    messageSub.unsubscribe();
    outboundSub.unsubscribe();
  }

},[])





  return(
    <Context.Provider value={{SERVER_IP, selectedChat, setSelectedChat, chatData, setChatData, chatMap, socket, chatScreenMode, setChatScreenMode, chatList, setChatList, CLRef, CSRef, newOutboundMessages, setNewOutboundMessages, newMessages, setNewMessages, profileData, setProfileData, outboundMessageStream}}>
      {children}
    </Context.Provider>
  )
}

export { ContextProvider, Context }
