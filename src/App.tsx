import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import PopUp from '../components/PopUp';
import { Preview } from '../utils/interfaces';
import Favourites from '../components/Favourites'

export default function App() {
  const [modalActive, setModalActive] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const [popUpActive, setPopUpActive] = useState(false);
  const [currentShow, setCurrentShow] = useState<Preview | null>(null);
  const [dashSelected, setDashSelected] = useState(true)
  const [filtersSelected, setFiltersSelected] = useState(false)

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
  };

  return (
    <div data-ref="app-container" className="relative">
      {modalActive && <Modal handleNav={navHandler} hidepopup={hidePopUp}/>}
      <Header />
      <Navbar handleNav={navHandler} isNavActive={navActive} hidepopup={hidePopUp} isFiltersSelected={filtersSelected}/>
      <Dashboard onTileClick={showPopUp} hidepopup={hidePopUp} handleNav={navHandler}/>
      <Favourites onTileClick={showPopUp} hidepopup={hidePopUp} handleNav={navHandler}/>
      {popUpActive && currentShow && <PopUp showId={currentShow.id} hidepopup={hidePopUp} closeModal={setModalActive}/>}
    </div>
  );
}
