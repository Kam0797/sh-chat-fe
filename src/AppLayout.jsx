import { Outlet, Route, Routes } from "react-router-dom";
import ChatList from "./pages/chatui/chat-list/ChatList";
import ChatScreen from "./pages/chatui/chat-area/ChatScreen";
import { useMediaQuery } from "react-responsive";
import Contacts from "./pages/contacts/Contacts";

export default function AppLayout() {

  const isWide = useMediaQuery({minWidth:650});
  if(isWide) {
  return(
 
    <div className="ui-wrapper">
      <ChatList />
      {/* <div>
      <Routes>
        <Route path="/sh-chat-fe/" element={<ChatList/>} />
      </Routes>
      </div> */}
      {/* <div> */}
      <Routes>
        <Route path='/sh-chat-fe/chat*' element={<ChatScreen/>} />
        <Route path='/sh-chat-fe/contacts' element={<Contacts />} />
      </Routes>
      {/* </div> */}
    </div>
  );
  }
  return (
    <div className="ui-wrapper">
      <Routes>
        <Route path='/sh-chat-fe/' element={<ChatList />} />
        <Route path='/sh-chat-fe/chat' element={<ChatScreen />} />
        <Route path='/sh-chat-fe/contacts' element={<Contacts />} />
      </Routes>
    </div>
  )
}