import axios from 'axios'
import ChatlistItem from '../../../components/chatlist-item/ChatListItem'
import './ChatList.css'
import { useContext } from 'react'
import { Context } from '../../../Context'
import { useNavigate } from 'react-router-dom'


import { SelectAndLoadMessages } from '../MessageHandler'


export default function ChatList({data}) {
  console.log('debug::ChatList::',data, typeof data)

  const { SERVER_IP } = useContext(Context)
  const navigate = useNavigate();


  async function handleLogout() {
    if(window.confirm("Click OK to logout")) {
      const res = await axios.get(SERVER_IP+'/auth/logout',
        {withCredentials: true}
      );
      if(res.data.code) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('uemail');
        console.log('LSlogLO::',localStorage.getItem('isLoggedIn'), localStorage.getItem('uemail'))
        navigate('/sh-chat-fe/login')
      }
    }
  }

  return(
    <>
      <div className='chat-list-wrapper' >
        <div className='options-bar'>
          <div className='sort-area'>
            <button className='sort-button all'>All</button>
            <button className='sort-button favorites'>Favs</button>
            <button className='sort-button groups'>Groups</button>
          </div>
          <div className='options-area'>
            <button className='search-button'>jk</button>
            <button className='logout-button' onClick={handleLogout}>LGO!</button>
          </div>
        </div>
        <div className='sort-list-wrapper'>
          <div className='sort-list'>
            {
              // console.log(typeof data, data.data)
              data?.map((chat) => {
                  return <ChatlistItem chat={chat} key={chat.chatId} />
              })
            }
          </div>
        </div>
      </div>
    </>
  )
}