import React, { useState } from "react"
import NavbarItems from "./NavbarItems"
import { motion, AnimatePresence } from "framer-motion"
import { onClickOutside } from "../utils/Helpers"

const Navbar: React.FC = () => {
  const [isToggled, setToggle] = useState<boolean>(false)

  const dashboard = document.querySelector('div[data-ref="dashboard-container"]')
  if(isToggled) { 
    dashboard?.classList.add('brightness-50')
    const navbarmenu = document.querySelector('div[data-ref="navbar-menu"]')
    console.log(navbarmenu?.textContent)
    if(navbarmenu) {
      onClickOutside(navbarmenu, () => setToggle(!isToggled))
    }
  }else {
    dashboard?.classList.remove('brightness-50')
  }

  const navContainer = {
    visible: {
      opacity: 1,
      transition: {
        x: { velocity: 100 },
        duration: 0.3,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        x: { velocity: 100 },
        duration: 0.3,
      },
    },
  }

  return (
    <>
      <button className="fixed top-5 left-0.5 z-20 w-10 h-10 text-3xl text-slate-400 rounded-full border-none cursor-pointer" onClick={() => {
        setToggle(!isToggled)
      }}>
        ≡
      </button>
      <AnimatePresence>
        {isToggled && (
          <motion.div
            data-ref="navbar-menu"
            className="fixed z-30 w-64 h-full mt-20 bg-gradient-to-b from-slate-800 to-white"
            initial="hidden"
            animate={isToggled ? "visible" : "hidden"}
            exit="hidden"
            variants={navContainer}
          >
            <NavbarItems isToggled={isToggled} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
  
}



export default Navbar
