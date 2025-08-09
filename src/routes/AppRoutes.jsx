import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/login/Login'
import ChatUI from '../pages/chatui/ChatUI';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sh-chat-fe/login' element={<Login />} />
        <Route path='/sh-chat-fe/' element={<ChatUI />} />
      </Routes>
    </BrowserRouter>
  );
}