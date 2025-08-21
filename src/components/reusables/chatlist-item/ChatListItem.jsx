import { useContext } from 'react'
import './ChatListItem.css'
import { Context } from '../../../Context';
import { useNavigate } from 'react-router-dom';

export default function ChatlistItem({chat}) {
  const { setSelectedChat} = useContext(Context);
  const navigate = useNavigate();

  // console.log('################',chat)
  return (
    <button className='chat-list-item' onClick={()=>{ navigate(`/sh-chat-fe/chat?chatId=${chat.chatId}`)} }>
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