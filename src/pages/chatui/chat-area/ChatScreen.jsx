import "./ChatScreen.css";

import Sh_chat_logo from "../../../assets/icons/sh_chat_logo.svg?react";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../../../Context";

import { chatsDB, sendMessageToDB } from "../utils";
import MessageBubble from "../../../components/reusables/message_bubble/MessageBubble";

export default function ChatScreen() {
  const { selectedChat, setSelectedChat, chatData } = useContext(Context);
  let messageFieldRef = useRef(null);
  // console.log('fook', chatMap.current)
  const [meta, setMeta] = useState(null); // data of chat profile

  // console.log('debug::CS:', typeof chatData, chatData);

  function handleSend() {
    sendMessageToDB(messageFieldRef.current.value, selectedChat, chatsDB);
    messageFieldRef.current.value = "";
  }

  useEffect(() => {
    if (!selectedChat) return;

    chatsDB.chats
      .where("chatId")
      .equals(selectedChat)
      .first()
      .then(setMeta)
      .catch(console.error);
  }, [selectedChat]);

  useEffect(()=> {
    window.scrollTo({
      top: document.body.scrollHeight
    })
  },[])

  return (
    <div className="chat-screen-wrapper">
      {selectedChat && (
        <>
          <div className="chat-screen-top-bar">
            <button className="profile-pic chat-back-button" onClick={()=>setSelectedChat(null)}>
              {meta && meta.members[0].slice(0, 2)}
            </button>
            <div className="details-area">
              <div className="chat-name">{meta && meta.members.join("-")}</div>
              <div className="status">{"not online"}</div>
            </div>
            <div className="options-area">{"opt"}</div>
          </div>

          {/* <div className="chat-area-wrapper"> */}
            <div className="chat-area">
              {/* <div className='chats-div'> */}
              {/*chats go here you may have to destroy this div*/}
              {
                chatData?.map((message, index) => {
                  return <MessageBubble mes={message} key={index} />;
                })
              }
              {/* </div> */}
            </div>
            <div className="message-send-area">
              <textarea
                // rows="1"
                placeholder="Type here"
                className="message-send-text"
                ref={messageFieldRef}
              />
              <button className="message-send-button" onClick={()=>{console.log('text:::',messageFieldRef.current.value); return handleSend()}}>
                <svg
                  class="send-button-logo"
                  viewBox="0 0 405 455"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    class="send-button-logo-path"
                    d="M136.861 388.855C135.483 391.317 132.054 391.645 130.233 389.491C93.6203 346.172 64.0242 326.345 3.7376 304.22C0.60787 303.071 0.179905 298.773 2.99296 296.984C182.769 182.641 271.335 115.904 397.039 1.63654C399.828 -0.89883 404.292 1.49695 403.742 5.22575C378.06 179.091 376.784 279.206 392.363 449.119C392.643 452.169 389.53 454.448 386.718 453.231C337.766 432.049 296.43 423.854 196.431 422.089C193.75 422.041 191.825 419.407 192.667 416.861C215.862 346.761 247.684 307.662 294.165 247.817C296.466 244.855 293.799 240.632 290.14 241.461L235.982 253.737C232.43 254.542 229.755 250.566 231.846 247.584C263.325 202.687 293.109 166.826 325.697 125.786C328.778 121.906 323.891 117.504 320.366 120.986C244.206 196.228 149.647 291.494 135.73 308.414C134.533 309.868 135.287 310.611 137.089 310.065L196.034 292.226C199.928 291.048 202.92 295.793 200.22 298.836C172.697 329.857 157.382 352.173 136.861 388.855Z"
                  />
                </svg>
              </button>
            </div>
          {/* </div> */}
        </>
      )}
      {!selectedChat && (
        <>
          <p className="profile-pic chat-screen-alt">
            <b>Sh_chat</b><br /> <i>quiet, works</i><br/> Click on a chat!
          </p>
        </>
      )}
    </div>
  );
}
