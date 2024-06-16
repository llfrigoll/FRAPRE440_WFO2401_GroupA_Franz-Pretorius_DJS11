import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import PopUp from '../components/PopUp';
import { Preview } from '../utils/interfaces';

export default function App() {
  const [modalActive, setModalActive] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const [popUpActive, setPopUpActive] = useState(false);
  const [currentShow, setCurrentShow] = useState<Preview | null>(null);

  const navHandler = (value: boolean) => {
    setModalActive(value);
    setNavActive(value);
  };

  const showPopUp = (show: Preview) => {
    setCurrentShow(show);
    setPopUpActive(true);
    setModalActive(true)
  };

  const hidePopUp = () => {
    setPopUpActive(false);
    setCurrentShow(null);
    setModalActive(false)
  };

  return (
    <div data-ref="app-container" className="relative">
      {modalActive && <Modal handleNav={navHandler} hidepopup={hidePopUp}/>}
      <Header />
      <Navbar handleNav={navHandler} isActive={navActive} />
      <Dashboard onTileClick={showPopUp} />
      {popUpActive && currentShow && <PopUp showId={currentShow.id} />}
    </div>
  );
}
