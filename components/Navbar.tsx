import React, { useState } from "react";
import NavbarItems from "./NavbarItems";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  handleModal: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ handleModal }) => {
  const [isToggled, setToggle] = useState<boolean>(false);

  const handleToggle = () => {
    const newState = !isToggled;
    setToggle(newState);
    handleModal(newState);
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
        className="fixed top-5 left-0.5 z-20 w-10 h-10 text-3xl text-slate-400 rounded-full border-none cursor-pointer"
        onClick={handleToggle}
      >
        ≡
      </button>
      <AnimatePresence>
        {isToggled && (
          <motion.div
            data-ref="navbar-menu"
            className="fixed z-80 w-64 h-full mt-20 bg-gradient-to-b from-slate-800 to-white"
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
