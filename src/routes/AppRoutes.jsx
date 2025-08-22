import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/login/Login'
import ChatUI from '../pages/chatui/ChatUI';
import AppLayout from '../AppLayout';
import ChatScreen from '../pages/chat-area/ChatScreen';
import ChatList from '../pages/chat-list/ChatList';
import Contacts from '../pages/contacts/Contacts';
import Settings from '../pages/settings/Settings';
// import Contacts from '../pages/contacts/Contacts';


export default function AppRoutes() {
  return (
      <Routes>
        <Route path='/sh-chat-fe/login' element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path='/sh-chat-fe/' element={<ChatList />} />
          <Route path='/sh-chat-fe/chat*' element={<ChatScreen/>} />
          <Route path='/sh-chat-fe/contacts' element={<Contacts />} />
          <Route path='/sh-chat-fe/settings' element={<Settings />} />
        </Route>
        {/* <Route path='/sh-chat-fe/contacts' element={<Contacts />} /> */}
      </Routes>
  );
}
