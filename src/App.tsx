import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';

export default function App() {
  const [modalActive, setModalActive] = useState(false);

  const modalHandler = (value: boolean) => {
    setModalActive(value);
  };

  return (
    <div data-ref="app-container" className="relative">
      {modalActive && <Modal handleModal={modalHandler} />}
      <Header />
      <Navbar handleModal={modalHandler} />
      <Dashboard />
    </div>
  );
}
