import React, { useState } from "react";
import NavbarItems from "./NavbarItems";
import { motion, AnimatePresence } from "framer-motion";

const Navbar: React.FC = () => {
  const [isToggled, setToggle] = useState<boolean>(false);

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
      <button className="absolute top-5 left-0.5 z-10 w-10 h-10 text-3xl text-slate-400 rounded-full border-none cursor-pointer" onClick={() => setToggle(!isToggled)}>
        ≡
      </button>
      <AnimatePresence>
        {isToggled && (
          <motion.div
            className="fixed z-20 w-64 h-full bg-gradient-to-b from-slate-800 to-white"
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
  );
};

export default Navbar;
