// import { useState } from 'react'
import "@fontsource/noto-sans/latin.css";
import "@fontsource/jetbrains-mono/latin.css"
import "@fontsource/montserrat/latin.css"
import "@fontsource/nunito/latin.css"
import "@fontsource/noto-sans/latin.css"

import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import { ContextProvider } from "./Context";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <ContextProvider>
          <AppRoutes />
        </ContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
