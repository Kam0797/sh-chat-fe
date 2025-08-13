
import { useRef } from 'react';
import './MessageBubble.css'

export default function MessageBubble({mes}) {

  console.log('Phere',mes.timestamp, mes)
  const timeObject = new Date(mes.timestamp);
  const time = `${timeObject.getHours()}.${String(timeObject.getMinutes()).padStart(2, '0')}`

  const bubbleAlignment = mes.sender?'flex-start':'flex-end';
  const bubbleBorderRadius = mes.sender?'10px 13px 10px 0':'13px 10px 0 10px';

  let messageRef = useRef(null)

  function changeWrap () {
    console.log('style',messageRef.current.style.wordBreak)
    messageRef.current.style.wordBreak = messageRef.current.style.wordBreak=='break-all'?'normal':'break-all';
  }
  return (
    <>
    <div className="message-bubble-wrapper" style={{justifyContent:bubbleAlignment}} onClick={()=>changeWrap()}>
      <div className="message-bubble" style={{borderRadius: bubbleBorderRadius}}>
        <div className="message" ref={messageRef} >{mes.content} </div>
        <div className="message-info">
          <div className="message-delivery-status">~</div>
          <div className="mesaage-time">{time} </div>
        </div>
      </div>
    </div>
    </>
  )
}