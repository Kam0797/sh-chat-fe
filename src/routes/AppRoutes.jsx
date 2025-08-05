import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/login/Login'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sh-chat-fe/' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}