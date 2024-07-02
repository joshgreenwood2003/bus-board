
import React, {useEffect, useMemo, useState } from 'react';


import "leaflet/dist/leaflet.css";
import './index.css'
import Home from './Pages/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BusInfo from './Pages/BusInfo';

function App(): React.ReactElement {

  return <BrowserRouter>
  <Routes>
    <Route path = "/" element = {<Home/>}></Route>
    <Route path = "/BusInfo/:BusID" element = {<BusInfo/>}></Route>
  </Routes>
  </BrowserRouter>

}
export default App;