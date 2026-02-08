import { useState } from 'react'
import {BrowserRouter, Routes, Route, useParams} from "react-router-dom";

import Home from "./home/Home.jsx";
import SignIn from "./signin/SignIn.jsx";
import Register from "./register/Register.jsx";
import MyAccount from "./account/myAccount.jsx";
import Video from "./home/Video.jsx";

import './App.css'

function App() {


  return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sign-in" element={<SignIn />} />
          <Route path="/:username" element={<MyAccount />} />
          <Route path="/watch" element={<Video />} />
          <Route path="/results" element={<Home />} />

        {/*<Route path="*" element={<NotFound />} />*/}
      </Routes>
    </BrowserRouter>
  )
}

export default App
