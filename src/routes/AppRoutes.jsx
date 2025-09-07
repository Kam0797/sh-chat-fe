import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react';

import Login from '../pages/login/Login'
// import ChatUI from '../pages/chatui/ChatUI';
const AppLayout = lazy(()=> import('../AppLayout'));

const ChatScreen = lazy(()=> import('../pages/chat-area/ChatScreen'));
const ChatList = lazy(()=> import('../pages/chat-list/ChatList'));
const Contacts = lazy(()=> import('../pages/contacts/Contacts'));
const Settings = lazy(()=> import('../pages/settings/Settings'));

// well, above is done for code splitting, do fallback component

export default function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path='/sh-chat-fe/login' element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path='/sh-chat-fe/' element={<ChatList />} />
          <Route path='/sh-chat-fe/chat' element={<ChatScreen/>} />
          <Route path='/sh-chat-fe/contacts' element={<Contacts />} />
          <Route path='/sh-chat-fe/settings' element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
