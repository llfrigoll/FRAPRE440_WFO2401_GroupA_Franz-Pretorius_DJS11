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
      <button
        className="w-10 h-10 rounded-full border-none bg-turquoise cursor-pointer z-10"
        onClick={() => setToggle(!isToggled)}
      >
        =
      </button>
      <AnimatePresence>
        {isToggled && (
          <motion.div
            className="w-64 h-full rounded-lg bg-gradient-to-t from-purple-600 to-purple-900"
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
