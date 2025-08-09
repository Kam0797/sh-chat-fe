import './ChatListItem.css'

export default function ChatlistItem({chat}) {
  return (
    <button className='chat-list-item' key={chat.chatId}>
      <div className='profile-pic'>{chat.name.slice(0,2)}</div>
      <div className='details-area'>
        <div className='name-time'>
          <div className='name'>{chat.name}</div>
          <div className='time'>{chat.time}</div>
        </div>
        <div className='message-notif'>
          <div className='message'>{chat.mes}</div>
          <div className='notif'>{1}</div>
        </div>
      </div>
    </button>
  )
}