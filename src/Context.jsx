

import axios from 'axios';
import { useState, createContext, useRef, useEffect } from 'react'
import { io } from 'socket.io-client';
import { Dexie, liveQuery } from 'dexie';

import { chatsDB, SelectAndLoadMessages, sendMessage, syncChats, themeHandler } from './utils/utils';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
const Context = createContext();

const SERVER_IP = 
window.location.hostname.startsWith('192.168')
? 'http://192.168.134.94:3000'
: 'https://sh-chat.onrender.com';

// const SERVER_IP = 'http://192.168.125.94:3000'

let socket = null;
try {
  if(axios.get(SERVER_IP+'/chat-room',{withCredentials: true})) {
    socket = io(SERVER_IP,
      {withCredentials: true}
    );
  }
} catch (err) {
  console.log('server offline', err)
}

// theme restore
if(localStorage.getItem('theme')) {
  console.info('Restoring theme...')
  const doc = document.querySelector('html')
  doc.dataset.theme = themeHandler(localStorage.getItem('theme'))
}


//observables
const unreadMessageStream = liveQuery(()=> {
  return chatsDB.messages
  .where('read')
  .equals(0)
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

  // conts
  const isWide = useMediaQuery({minWidth:650});
  const isTouchScreen = useMediaQuery({query: "(pointer:coarse)"})




  
  //state vars
  const [selectedChat, setSelectedChat] = useState(null)
  const [chatData, setChatData] = useState([])
  const [chatScreenMode, setChatScreenMode] = useState('messaging')
  const [chatList, setChatList] = useState([]);
  const [newMessages, setNewMessages] = useState(null)
  const [newOutboundMessages, setNewOutboundMessages] = useState(null)
  const [contactsMap, setContactsMap] = useState(new Map())
  const [unreadMap, setUnreadMap] = useState(new Map())
  // const [theme, setTheme] = useState('')

  //settings stuff
  const profileTemplate = {
    uid: '',
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

async function makeContactsMap() {
  const contactsArray = await chatsDB.contacts.toArray();
  // console.log('#7:contacts',JSON.stringify(contacts,0,1))
  const contacts = new Map();
  contactsArray.map(({uemail, nickname}) => {
    contacts.set(uemail, nickname)
  })
  setContactsMap(contacts)
}
async function getAndSetContactsData() {
  await makeContactsMap(); // just load from IDB
  const allUemails = new Set();
  const chatData = await chatsDB.chats.toArray();
  if(Array.isArray(chatData) && chatData.length > 0) {
    chatData.map(chat => {
      chat?.members?.forEach(member=> {
        allUemails.add(member)
      })
    })
  }
  if(allUemails.size > 0) {
    try{
    const nicknamesArray = await axios.post(`${SERVER_IP}/users/nicknames`,{users: [...allUemails]}, {withCredentials: true});
    const nicknames = nicknamesArray.data.contacts;
    if(nicknames) {
      nicknames.forEach(async ({uemail,nickname})=> {
        await chatsDB.contacts.put({uemail: uemail, nickname: nickname})
      })
    }
  }catch(e) {
    console.error('Error#1::',e)
  }
  }
  await makeContactsMap(); // after server fetch
}

// useEffect(() => {
//   const updateHeight = () => {
//     document.documentElement.style.setProperty(
//       "--vh",
//       `${window.visualViewport.height * 0.01}px`
//     );
//   };
//   window.visualViewport.addEventListener("resize", updateHeight);
//   updateHeight();
//   return () =>
//     window.visualViewport.removeEventListener("resize", updateHeight);
// }, []);



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

  socket?.on('messagesToClient',async (incomingMessages)=> {
    try {
    console.log('imes:', typeof incomingMessages, incomingMessages, !incomingMessages?.size);
    // incomingMessages?.forEach(async message =>
      if(incomingMessages.size == 0) return;
    for(const message of incomingMessages ?? []) {
      
      const exists = await chatsDB.messages.get(message.s_uid);
      if (!exists) {
        message.read = 0;
        await chatsDB.messages.put(message);
        socket.emit('confirmMessagesToClient',[message.s_uid])
        console.log('incoming mes:',message, 'conf sent')
      }
      const log1 = await chatsDB.messages.where('s_uid').equals(message.s_uid).toArray()
      console.log('uid',log1)
    }
    console.log('messages fetched and saved in IDB. Fin mes:', incomingMessages[-1] || []);
    }
    catch (err) {
      console.error('error in fetching/saving to IDB', err);
    }
  })
  socket.on('messagesToServerS',async (incomingSuid)=> {
    const {temp_uid, s_uid} = incomingSuid;
    await chatsDB.messages.where("temp_uid").equals(temp_uid).modify({s_uid:s_uid, sendPending:0})
    // theres a room for simplification: if(!temp_id) = sendPending==1
    // but liveQuery may not pick it, and is towards obsurity. so i think to keep it as above :)
  })

  // subs
  const unreadMessageSub = unreadMessageStream.subscribe( {
    // trigger renders, add notifs - no, just make a map
    next: messages => {
      const chatIdMap = new Map()
      messages.forEach(({chatId}) => {
        if(!chatId) return
        chatIdMap.set(chatId, (chatIdMap.get(chatId) || 0) + 1)
      })
      setUnreadMap(chatIdMap)
      // console.log('msstream', messages)
      // console.log('unreadMap:',unreadMap, chatIdMap)
    },
    error: err => {
      console.error('debug:unreadmessageSub',err)
    }
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
  getAndSetContactsData();

  // console.log(typeof chatList, chatList)
  return ()=> {
    socket?.disconnect();
    unreadMessageSub.unsubscribe();
    outboundSub.unsubscribe();
  }

},[])







  return(
    <Context.Provider value={{SERVER_IP, selectedChat, setSelectedChat, chatData, setChatData, chatMap, socket, chatScreenMode, setChatScreenMode, chatList, setChatList, CLRef, CSRef, newOutboundMessages, setNewOutboundMessages, newMessages, setNewMessages, profileData, setProfileData, outboundMessageStream, contactsMap, setContactsMap, getAndSetContactsData, makeContactsMap, unreadMap, isWide, isTouchScreen}}>
      {children}
    </Context.Provider>
  )
}

export { ContextProvider, Context }
