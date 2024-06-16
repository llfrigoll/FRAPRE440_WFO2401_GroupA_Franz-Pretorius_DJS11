import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

export default function App() {
  const [modalActive, setModalActive] = useState(false);
  const [navActive, setNavActive] = useState(false);

  const navHandler = (value: boolean) => {
    setModalActive(value);
    setNavActive(value)
  };

  return (
    <div data-ref="app-container" className="relative">
      {modalActive && <Modal handleNav={navHandler} />}
      <Header />
      <Navbar handleNav={navHandler} isActive ={navActive}/>
      <Dashboard />
    </div>
  );
}
