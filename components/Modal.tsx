import React from "react"

interface ModalProps {
    handleNav: (value: boolean) => void;
    hidepopup: () => void;
  }

export default function Modal({handleNav, hidepopup}: ModalProps) {
    const modalClicked = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        handleNav(false);
        hidepopup()
    }

    return (
        <div data-ref="modal" onClick={modalClicked} className="absolute w-full h-full bg-black z-70 opacity-50 visible"></div>
    )
}
