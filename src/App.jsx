// import { useState } from 'react'
import "@fontsource/noto-sans";
import "@fontsource/jetbrains-mono"
import "@fontsource/montserrat"
import "@fontsource/nunito"

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
