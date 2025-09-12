import { useContext, useEffect, useRef, useState } from "react";
import "./Contacts.css";
import { Context } from "../../Context";
import validator from "validator";
import axios from "axios";

import { chatsDB, createChat, syncChats } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import ContactsItem from "../../components/reusables/contacts-item/ContactsItem";
import NewChatMember from "../../components/reusables/new-chat-member/NewChatMember";

export default function Contacts() {
  const [newChatMembers, setNewChatMembers] = useState([]);
  // const [contacts, setContacts] = useState([])
  const {
    setChatScreenMode,
    SERVER_IP,
    setSelectedChat,
    setChatList,
    selectedChat,
    contactsMap,
    getAndSetContactsData
  } = useContext(Context);
  const navigate = useNavigate();
  let searchBoxRef = useRef(null);
  let selectedMembersAreaRef = useRef(null);
  let chatNameRef = useRef(null);

  async function addMembers(e) {
    console.log("works", e.target.value);
    const unverifiedEmail = e.target.value.trim();
    if (unverifiedEmail.length > 5 && validator.isEmail(unverifiedEmail)) {
      // these arent for fun, add alerts, the sig way
      if (unverifiedEmail == localStorage.getItem("uemail")) {
        return;
      }
      if (newChatMembers.includes(unverifiedEmail)) {
        return;
      }
      try {
        const {
          data: { uemail },
        } = await axios.get(
          `${SERVER_IP}/user/exists?uemail=${unverifiedEmail}`,
          { withCredentials: true }
        );
        console.log("ve", uemail);
        if (uemail) {
          setNewChatMembers((mems) => [...mems, uemail]);
          e.target.value = "";
          console.log("debug::contacts::addmembers:pushed_uemail:", uemail);
        } else {
          console.log("depug::", unverifiedEmail);
        }
      } catch (err) {
        console.error("network/server error");
      }
    }
  }
  function removeNewMember(newMemberEmail) {
    setNewChatMembers((newChatMembers) =>
      newChatMembers.filter((mem) => mem !== newMemberEmail)
    );
  }
  function addMemberFromList(newMemEmail) {
    if (
      contactsMap &&
      (!contactsMap.has(newMemEmail) ||
      newChatMembers.includes(newMemEmail))
    )
      return;
    setNewChatMembers((newChatMembers) => [...newChatMembers, newMemEmail]);
  }

  // useEffect(()=> {
  //   console.log('#3::',typeof contactsMap, [...contactsMap])

  // })

  async function handleCreateChat() {
    if(newChatMembers.length > 1 && chatNameRef.current.value.trim() == '') {
      console.error('group requires a name');
      // call notif
      return
    }
    const res = await createChat(
      newChatMembers,
      SERVER_IP,
      chatsDB,
      setSelectedChat,
      chatNameRef.current.value.trim()
    );
    console.log("res", res);
    if (res.code == 1 || res.code == 2) {
      //this 'code' is return by createChat, not server
      const chats = await syncChats(SERVER_IP, chatsDB);
      setChatList(chats);
      getAndSetContactsData();
      navigate(`/sh-chat-fe/chat?chatId=${res.chatId}`);
      // setTimeout(()=>{console.log(selectedChat ); return setSelectedChat(res.chatId)},400)
      // setChatScreenMode('messaging')
      console.log("sel", selectedChat);
    } else {
      return;
    }
  }

  useEffect(() => {
    if (newChatMembers.length === 0) {
      selectedMembersAreaRef.current.classList.remove("add-5pd");
    } else {
      selectedMembersAreaRef.current.classList.add("add-5pd");
    }
  }, [newChatMembers]);

  return (
    <>
      <div className="contacts-wrapper">
        <div className="contacts-header">
          <button
            className="back-to-messaging"
            onClick={() => {
              navigate("/sh-chat-fe/");
            }}
          >
            &#x21A9;
          </button>
          <span className="Contacts-heading f-m">Contacts</span>
        </div>
        <div className="contacts-search-area">
          <div className="contacts-search-box-area">
            <input
              className="contacts-search-box"
              type="text"
              placeholder="Type email to add contact"
              ref={searchBoxRef}
              onKeyDown={(e) => {
                if (e.key == " " || e.key == "Enter") addMembers(e);
              }}
            />
            {newChatMembers.length > 0 &&
              <button
              className="new-chat-button"
              onClick={() => {
                return handleCreateChat();
              }}
            >
              {newChatMembers.length < 2?`Open Chat`:'Make Group'}
            </button>
            }
          </div>
          <div
            className="selected-members-area add-5pd"
            ref={selectedMembersAreaRef}
          >
            {newChatMembers?.map((newMember, key) => {
              return (
                <NewChatMember
                  newChatMember={newMember}
                  removeNewMember={removeNewMember}
                  key={key}
                />
              );
            })}
          </div>
          {newChatMembers.length > 1 &&
            <input className="chat-name-input f-nunito" placeholder="A cool name for this chat.." ref={chatNameRef} />
          }
        </div>
        <div className="contacts-list-wrapper">
          <div className="contacts-list">
            {Array.from(contactsMap.entries())?.map((contact, index) =>
              contact[0] !== localStorage.getItem("uemail") ? (
                <ContactsItem
                  contact={contact}
                  addMemberFromList={addMemberFromList}
                  key={index}
                />
              ) : null
            )}
          </div>
        </div>
      </div>
    </>
  );
}
