import axios from 'axios'
import ChatlistItem from '../../components/reusables/chatlist-item/ChatListItem'
import './ChatList.css'
import { useContext, useEffect } from 'react'
import { Context } from '../../Context'
import { useNavigate } from 'react-router-dom'


import { chatsDB, SelectAndLoadMessages, sendMessage, syncChats } from '../../utils/utils'
import { liveQuery } from 'dexie'


export default function ChatList() {
  const {SERVER_IP, selectedChat, setChatData , socket, chatList, setChatList, } = useContext(Context);
  const navigate = useNavigate();
  // console.log('debug::ChatList::',data, typeof data)

  // const { SERVER_IP, ChatList, setChatScreenMode } = useContext(Context)
  // const navigate = useNavigate();
  // let newChatRef = useRef(null);




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
    console.log('chatui::UE::openlog:isLoggedIn',localStorage.getItem('isLoggedIn'));
 
    // IIFC
    (async()=> {
      try {
      const res = await axios.get(SERVER_IP+'/chat-room',
        {withCredentials: true});
        if(!res.data.code || localStorage.getItem('isLoggedIn') === 'false') {
          navigate('/sh-chat-fe/login')
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


  setChatData(SelectAndLoadMessages(selectedChat,chatsDB))


  return(
    <>
      <div className='chat-list-wrapper' >
        <button className='new-chat' onClick={()=>{navigate('/sh-chat-fe/contacts')}} >+</button>
        <div className='options-bar'>
          <div className='sort-area'>
            <button className='sort-button all'>All</button>
            <button className='sort-button favorites'>Favs</button>
            <button className='sort-button groups'>Groups</button>
          </div>
          <div className='options-area'>
            <button className='search-button'></button>
            <button className='app-options' onClick={()=> {navigate('/sh-chat-fe/settings')}}>
                <div className='options-dot'></div>
                <div className='options-dot'></div>
                <div className='options-dot'></div>
            </button>
          </div>
        </div>
        <div className='sort-list-wrapper'>
          <div className='sort-list'>
            {
              chatList?.map((chat) => {
                  return <ChatlistItem chat={chat} key={chat.chatId} />
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}