import React from 'react'
import { motion } from 'framer-motion'

interface NavItemsProps {
    handleDashClick: () => void
    handleFavClick: () => void
}

const NavbarItems: React.FC<NavItemsProps> = ({
    handleDashClick,
    handleFavClick,
}) => {
    const items = ['Dashboard', 'Favourites', 'Clear Listen History']

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
    }

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
    }

    const handleClearClick = () => {
        if (
            confirm(
                'Are you sure you want to clear your listening history?\nNote: Favourites will not be cleared.'
            )
        ) {
            Object.keys(localStorage).forEach(function (key) {
                if (key.endsWith('_audio') || key.endsWith('_ended')) {
                    localStorage.removeItem(key)
                }
            })
        }
    }

    const itemClickHandler = (
        event: React.MouseEvent<HTMLParagraphElement>
    ) => {
        if (event.currentTarget.textContent === 'Dashboard') {
            handleDashClick()
        } else {
            if (event.currentTarget.textContent === 'Favourites') {
                handleFavClick()
            } else {
                handleClearClick()
            }
        }
    }

    return (
        <motion.ul
            className="flex flex-col items-start pt-12  px-16 pb-52"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={navList}>
            {items.map(item => (
                <motion.li
                    className={
                        item === 'Clear Listen History'
                            ? 'text-base text-red-200 cursor-pointer list-none mt-10 pr-6 leading-tight text-center'
                            : 'text-xl text-slate-300 cursor-pointer list-none mb-7'
                    }
                    variants={navItem}
                    key={item}>
                    <p onClick={itemClickHandler}>{item}</p>
                </motion.li>
            ))}
        </motion.ul>
    )
}

export default NavbarItems
