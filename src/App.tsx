import Dashboard from './Dashboard'
import Header from '../components/Header'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import Modal from '../components/Modal'

export default function App() {
  const [modalActive, setModalActive] = useState(false)

  function modalHandler(value: boolean) {
    setModalActive(value)
  }

  let modal = modalActive ? <Modal handleModal ={modalHandler}/> : ''

  return (
    <div data-ref="app-container" className="relative">
      <>{modal}</>
      <Header />
      <Navbar handleModal ={modalHandler}/>
      <Dashboard />
    </div>
  )
}