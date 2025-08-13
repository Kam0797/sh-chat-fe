import { useContext } from 'react'
import './ChatListItem.css'
import { Context } from '../../../Context';

export default function ChatlistItem({chat}) {
  const { setSelectedChat} = useContext(Context);

  // console.log('################',chat)
  return (
    <button className='chat-list-item' onClick={()=>setSelectedChat(chat.chatId)}>
      <div className='profile-pic'>{chat.chatId.slice(0,2)}</div>
      <div className='details-area'>
        <div className='name-time'>
          <div className='name'>{chat.members.join(' ')}</div>
          <div className='time'>{chat.chatId.slice(2,4)}</div>
        </div>
        <div className='message-notif'>
          <div className='last-message'>{chat.chatId}</div>
          <div className='notif'>{1}</div>
        </div>
      </div>
    </button>
  )
}