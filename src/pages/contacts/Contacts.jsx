

import { useContext, useEffect, useRef, useState } from 'react'
import './Contacts.css'
import { Context } from '../../Context'
import validator from 'validator'
import axios from 'axios'

import { chatsDB, createChat, syncChats } from '../../utils/utils'
import { useNavigate } from 'react-router-dom'

export default function Contacts() {

  const [newChatMembers, setNewChatMembers] = useState([])
  const { setChatScreenMode, SERVER_IP , setSelectedChat, setChatList, selectedChat} = useContext(Context)
  const navigate = useNavigate()
  let searchBoxRef = useRef(null)

  // useEffect(()=>{  
  //   searchBoxRef.current.addEventListener('input', (e)=>{
  //     console.log('works')
  //     if(searchBoxRef.current.value != '' && searchBoxRef.current.value.slice(-1) == ' ') {
  //       addMembers(searchBoxRef)
  //     }
  //   }) 
  //   return()=> {
  //     searchBoxRef.current.removeEventListener()
  //   }
  // },[])


  async function addMembers(e) {
    console.log('works',e.target.value)
    const unverifiedEmail = e.target.value.trim();
    if(unverifiedEmail.length > 5  && validator.isEmail(unverifiedEmail)) {

      // these arent for fun, add alerts, the sig way
      if(unverifiedEmail == localStorage.getItem('uemail')) {
        return;
      }
      if(newChatMembers.includes(unverifiedEmail)) {
        return;
      }
      try {
        const {data: {uemail}} = await axios.get(`${SERVER_IP}/user/exists?uemail=${unverifiedEmail}`,{withCredentials:true});
        console.log('ve',uemail)
        if(uemail) {
          setNewChatMembers(mems => [...mems,uemail]);
          e.target.value = '';
          console.log('debug::contacts::addmembers:pushed_uemail:',uemail);
        }
        else {
          console.log('depug::',unverifiedEmail)
        }
      } catch(err) {
        console.error('network/server error')
      }
    }
  }

  async function handleCreateChat() {
    const res = await createChat(newChatMembers, SERVER_IP, chatsDB, setSelectedChat);
    console.log('res',res)
    if(res == 1 || res == 2) {
      const chats = await syncChats(SERVER_IP, chatsDB)
      setChatList(chats);
      // setTimeout(()=>{console.log(selectedChat ); return setSelectedChat(res.chatId)},400)
      setChatScreenMode('messaging')
      console.log('sel',selectedChat )
    }
    else {
      return;
    }
  }


  return (
    <>
    <div className='contacts-wrapper'>
      <div className='contacts-header'>
        <button className='back-to-messaging' onClick={()=> {navigate('/sh-chat-fe/')}} >&#x21A9;</button>
        <span className='Contacts-heading'>Contacts</span>
      </div>
      <div className='contacts-search-area'>
        <div className='contacts-search-box-area'>
          <input className='contacts-search-box' type='text' ref={searchBoxRef} onKeyDown={(e)=> {if(e.key == ' ' || e.key == 'Enter') addMembers(e)}} />
          <button className='new-chat-button' onClick={()=>{return handleCreateChat() }}>Chat!</button>
        </div>
        <div className='selected-members-area'>
          {
            newChatMembers?.map((newMember,key) => {
              return <div key={key}>{newMember}</div> //make a comp with rm
            })
          }
        </div>
      </div>
      <div className='contacts-list-wrapper'>
        <div className='contacts-list'>
          contacts appear here
        </div>
      </div>
    </div>
    </>
  )
}