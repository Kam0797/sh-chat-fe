
import { useEffect, useRef } from 'react';
import './MessageBubble.css'
import { chatsDB } from '../../../utils/utils';

export default function MessageBubble({mes, isGroup}) {

  const timeObject = new Date(mes.timestamp);
  const time = `${timeObject.getHours()}.${String(timeObject.getMinutes()).padStart(2, '0')}`

  const bubbleAlignment = mes.sender?'flex-start':'flex-end';
  const bubbleBorderRadius = mes.sender?'10px 13px 10px 0':'13px 10px 0 10px';

  const senderNameBorderRadius = mes.sender?'7px 10px 2px 2px':'0 0 0 0'; // whotf cares about :... part?

  let messageRef = useRef(null)

  function changeWrap () {
    messageRef.current.style.wordBreak = messageRef.current.style.wordBreak=='break-all'?'normal':'break-all';
  }
  async function markRead() {
    if(!mes.s_uid) return
    await chatsDB.messages.where("s_uid").equals(mes.s_uid).modify({read: true})
  }

useEffect(()=> {
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry =>{
      if(entry.isIntersecting) {
        markRead();
      }

    })
  },{
    threshold: 1
  });
  observer.observe(messageRef.current)
},[mes.s_uid])

  return (
    <>
    <div className="message-bubble-wrapper" style={{justifyContent:bubbleAlignment}} >
      <div className="message-bubble" style={{borderRadius: bubbleBorderRadius}} onClick={()=>changeWrap()}>
        { isGroup && mes?.sender &&
          <div className='sender-name' style={{borderRadius: senderNameBorderRadius}}>{mes.sender}</div>
        }
        <div className="message f-nunito" ref={messageRef} >{mes.content} </div>
        <div className="message-info">
          <div className="message-delivery-status">{mes.s_uid && !mes.sender? '\u2726':null}</div> 
          <div className="mesaage-time">{time} </div>
        </div>
      </div>
    </div>
    </>
  )
}