import { useState } from 'react'
import Dashboard from './Dashboard'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import PopUp from '../components/PopUp'
import { Preview } from '../utils/interfaces'
import Favourites from './Favourites'

export default function App() {
    //States used in App
    const [modalActive, setModalActive] = useState(false)
    const [navActive, setNavActive] = useState(false)
    const [popUpActive, setPopUpActive] = useState(false)
    const [currentShow, setCurrentShow] = useState<Preview | null>(null)
    const [dashSelected, setDashSelected] = useState(true)
    const [favouritesSelected, setFavouritesSelected] = useState(false)

    // Opens/Closes the Navbar and Modal
    const navHandler = (value: boolean) => {
        setModalActive(value)
        setNavActive(value)
    }

    //Shows show Popup
    const showPopUp = (show: Preview) => {
        setCurrentShow(show)
        setPopUpActive(true)
        setModalActive(true)
    }

    //Hides show popup
    const hidePopUp = () => {
        setPopUpActive(false)
        setCurrentShow(null)
    }

    //Returns component containing Header, Modal, Navbar, Dashboard, Popups and Favourites
    return (
        <div data-ref="app-container" className="relative">
            {modalActive && (
                <Modal handleNav={navHandler} hidepopup={hidePopUp} />
            )}
            <Header />
            <Navbar
                handleNav={navHandler}
                isNavActive={navActive}
                hidepopup={hidePopUp}
                handleFavouritesSelected={setFavouritesSelected}
                handleDashboardSelected={setDashSelected}
            />
            {dashSelected && (
                <Dashboard
                    onTileClick={showPopUp}
                    hidepopup={hidePopUp}
                    handleNav={navHandler}
                />
            )}
            {favouritesSelected && <Favourites />}
            {popUpActive && currentShow && (
                <PopUp
                    showId={currentShow.id}
                    hidepopup={hidePopUp}
                    closeModal={setModalActive}
                />
            )}
        </div>
    )
}
