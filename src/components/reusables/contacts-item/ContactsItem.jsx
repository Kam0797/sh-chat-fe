

import { useContext } from 'react'
import { chatsDB, createChat } from '../../../utils/utils'
import './ContactsItem.css'
import { Context } from '../../../Context'
import { useNavigate } from 'react-router-dom'

export default function ContactsItem({contact, addMemberFromList}) {
  const navigate = useNavigate()
  const {SERVER_IP, setSelectedChat} = useContext(Context)

  async function createChatFromList() {
    const chat = await createChat([contact[0]],SERVER_IP, chatsDB, setSelectedChat);
    if(chat.chatId) {
      navigate(`/sh-chat-fe/chat?chatId=${chat.chatId}`)
    }
  }


  return(
    <>
      <div className='contacts-item-wrapper'>
        <div className='profile-pic f-jbm'><span className='add-ellipsis f-jbm'>{contact[1]?.slice(0,2) }</span></div>
        <div className='c-name-email-wrapper'>
          <div className='contact-name'><span className='add-ellipsis f-nunito'>{contact[1]+'hHHSHSSHXSJSJHAssgsd'}</span></div>
          <div className='contact-email'><span className='add-ellipsis f-jbm'>{contact[0]}</span></div>
          <button className='open-chat' onClick={()=> createChatFromList()}>&#x27A4;</button>
        </div>
        <button className='add-up' onClick={()=>addMemberFromList(contact[0])}>+</button>
      </div>
    </>
  )
}