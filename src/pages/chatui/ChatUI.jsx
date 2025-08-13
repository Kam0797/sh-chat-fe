import './ChatUI.css'

import ChatList from './chat-list/ChatList'
import ChatScreen from './chat-area/ChatScreen'
import Contacts from '../../components/contacts/Contacts'

import { useContext, useEffect, useRef, useState } from 'react'
import { Context } from '../../Context'
import { useNavigate } from 'react-router-dom'
import Dexie, {liveQuery} from 'dexie'
import {io} from 'socket.io-client'
import { useObservable } from 'react-use'


import { chatsDB, SelectAndLoadMessages, sendMessage, syncChats } from './MessageHandler'




// const chatData = {
//   name: 'sh some-name',
//   messages: ['sfdghjnkkl jukl','hyhjgjuhk jyhiuj','duhiduh uiyy  f7 ry','uyydy 7dy6y6  duygd ','djhuihugd  dygdyuh']
// }

export default function ChatUI() {
  const {SERVER_IP, selectedChat, chatData, setChatData, chatMap , socket, chatScreenMode, chatList, setChatList} = useContext(Context);
  const navigate = useNavigate();
  // const [newMessages, setNewMessages] = useState(null)
  // const [newOutboundMessages, setNewOutboundMessages] = useState(null)


  //sock


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



  useEffect(()=> {
    if(!localStorage.getItem('isLoggedIn')) {
      console.log('nay')
      navigate('/sh-chat-fe/login');
    }  

    socket?.on('connection',()=> {

    }); // may have to reconnect

    socket?.on('messagesToClient',(incomingMessages)=> {
      try {
      console.log('imes:', typeof incomingMessages, incomingMessages);
      incomingMessages?.forEach(async message => {
        const exists = await chatsDB.messages.get(message.s_uid);
        if (!exists) {
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
      const chats = await syncChats(SERVER_IP, chatsDB)
      setChatList(chats);
      // chatMap.current = await chatsDB.chats.toArray();
    })()


    // console.log(typeof chatList, chatList)
    return ()=> {
      socket?.disconnect();
      messageSub.unsubscribe();
      outboundSub.unsubscribe();
    }

  },[])

  // useEffect(()=> {
  //   (async()=> {
  //     const messages1 = await selectAndLoadMessages(selectedChat, chatsDB);
  //     console.log('mess',messages1)
  //     setChatData(messages1);
  //     console.log('debug::IIFC:',chatData, messages1)
  //   })()

  // },[selectedChat])
  
  setChatData(SelectAndLoadMessages(selectedChat,chatsDB))
  // setChatList(SetChatListOnListUpdate(chatsDB))



  

  return(
    <>
    <div className='ui-wrapper'>
      <ChatList data={chatList} />
      { (chatScreenMode == 'messaging') &&
        <ChatScreen />
      }
      { (chatScreenMode == 'contacts') &&
        <Contacts />
      }
    </div>
    </>
  )
}
