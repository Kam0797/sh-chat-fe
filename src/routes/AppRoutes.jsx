import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/login/Login'
import ChatUI from '../pages/chatui/ChatUI';
// import Contacts from '../pages/contacts/Contacts';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sh-chat-fe/login' element={<Login />} />
        <Route path='/sh-chat-fe/' element={<ChatUI />} />
        {/* <Route path='/sh-chat-fe/contacts' element={<Contacts />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
