import React from "react";
import NavbarItems from "./NavbarItems";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  handleNav: (value: boolean) => void;
  isNavActive: boolean;
  hidepopup: () => void;
  handleFavouritesSelected: (value: boolean) => void
  handleDashboardSelected: (value: boolean) => void
}

const Navbar: React.FC<NavbarProps> = ({ handleNav, isNavActive, hidepopup, handleDashboardSelected, handleFavouritesSelected }) => {

  const handleToggle = () => {
    handleNav(!isNavActive);
    hidepopup()
  };

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
  };

  const handleFavClick = () => {
    handleDashboardSelected(false)
    handleFavouritesSelected(true)
  }

  const handleDashClick = () => {
    handleFavouritesSelected(false)
    handleDashboardSelected(true)
  }

  return (
    <>
      <button
        className="fixed top-5 left-0.5 z-50 w-10 h-10 text-3xl text-slate-400 rounded-full border-none cursor-pointer"
        onClick={handleToggle}
      >
        ≡
      </button>
      <AnimatePresence>
        {isNavActive && (
          <motion.div
            data-ref="navbar-menu"
            className="fixed z-50 w-64 h-full mt-20 bg-gradient-to-b from-slate-800 to-white"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={navContainer}
          >
            <NavbarItems handleDashClick={handleDashClick} handleFavClick={handleFavClick}/>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
