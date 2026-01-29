import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from "./home/Home.jsx";
import SignIn from "./signin/SignIn.jsx";
import Register from "./register/Register.jsx";

import './App.css'

function App() {

  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sign-in" element={<SignIn />} />

        {/*<Route path="*" element={<NotFound />} />*/}
      </Routes>
    </BrowserRouter>
  )
}

export default App
