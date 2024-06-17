import React from "react";
import NavbarItems from "./NavbarItems";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  handleNav: (value: boolean) => void;
  isActive: boolean;
  hidepopup: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleNav, isActive, hidepopup }) => {

  const handleToggle = () => {
    handleNav(!isActive);
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

  return (
    <>
      <button
        className="fixed top-5 left-0.5 z-50 w-10 h-10 text-3xl text-slate-400 rounded-full border-none cursor-pointer"
        onClick={handleToggle}
      >
        ≡
      </button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            data-ref="navbar-menu"
            className="fixed z-50 w-64 h-full mt-20 bg-gradient-to-b from-slate-800 to-white"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={navContainer}
          >
            <NavbarItems />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
