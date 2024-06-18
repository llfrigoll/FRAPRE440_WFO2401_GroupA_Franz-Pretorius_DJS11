import React from "react";
import { motion } from "framer-motion";
import { useLinkClickHandler } from "react-router-dom";

const NavbarItems: React.FC = () => {
  const items = ["Dashboard", "Favourites"];

  const navList = {
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.07,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const navItem = {
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    hidden: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
  };

  const itemClickHandler = (event: React.MouseEvent<HTMLParagraphElement>) => {
    if(event.currentTarget.textContent === "Dashboard") {
      
    }
  }

  return (
    <motion.ul
      className="flex flex-col items-start pt-12  px-16 pb-52"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={navList}
    >
      {items.map((item) => (
        <motion.li
          className="text-xl text-slate-300 cursor-pointer list-none mb-7"
          variants={navItem}
          key={item}
        >
          <p onClick={itemClickHandler}>{item}</p>
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default NavbarItems;
