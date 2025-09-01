import { useContext, useEffect, useState } from 'react'
import './ChatListItem.css'
import { Context } from '../../../Context';
import { useNavigate } from 'react-router-dom';
import { chatsDB, getChatName } from '../../../utils/utils';

export default function ChatlistItem({chat}) {
  const { setSelectedChat, contactsMap, selectedChat, unreadMap} = useContext(Context);
  const navigate = useNavigate();
  const [lastMessage, setLastMessage] = useState(null)

  // const chatName = getChatName(chat, contactsMap)
  // console.log('#12.1::',chatName)

  async function getLastMessage(DB, chatId) {
    const mes = await DB?.messages.where("chatId").equals(chatId).sortBy("timestamp");
    const lastMes = mes.at(-1) ?? '';
    setLastMessage(lastMes)
  }
  function formatTime(timestamp) {
    if(!timestamp) return ''
    const timeObj = new Date(timestamp);
    const hours = timeObj.getHours().toString().padStart(2, '0')
    const minutes = timeObj.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  useEffect(()=> {
    (async()=>{getLastMessage(chatsDB, chat.chatId)})()
  },[unreadMap])

  useEffect(()=> {
    console.log('URmap',unreadMap)
  },[unreadMap])

  // console.log('################',chat)
  return (
    lastMessage &&
    <button className='chat-list-item' onClick={()=>{ navigate(`/sh-chat-fe/chat?chatId=${chat.chatId}`)} }>
      <div className='profile-pic f-jbm'>{getChatName(chat, contactsMap)?.slice(0,2)}</div>
      <div className='details-area'>
        <div className='name-time'>
          <div className='name'><span className='add-ellipsis f-nunito'>{getChatName(chat, contactsMap)}</span></div>
          <div className='time f-jbm'>{formatTime(lastMessage?.timestamp)}</div>
        </div>
        <div className='message-unreadcount'>
          <div className='last-message'><span className='add-ellipsis f-m'>{lastMessage?.content}</span></div>
          {unreadMap?.get(chat.chatId) && <div className='unread-count'>{unreadMap?.get(chat.chatId) < 100 ? unreadMap?.get(chat.chatId) : '99+'}</div>}
        </div>
      </div>
    </button>
  )
}