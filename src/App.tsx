import React from 'react';
import logo from './logo.svg';
import './App.css';
import Connectnetworks from './component/connectnetworks';
import ImportToken from './component/importtokens';
import BSCToken from './component/BSCToken';

function App() {
  return (
    <div>
     <Connectnetworks />
     <ImportToken address={"0x29B53aaABD2CAc4e1104bE1373D5B5aba9a4507A"}/>
     <BSCToken address={"0x4B4Bf5D871Cf6eC659F6a16fe9129f8F1EdF27d3"} />
     
    </div>
  );
}

export default App;
