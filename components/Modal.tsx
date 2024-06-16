import React from "react"

interface ModalProps {
    handleNav: (value: boolean) => void;
  }

export default function Modal({handleNav}: ModalProps) {
    const modalClicked = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        handleNav(false);
    }

    return (
        <div data-ref="modal" onClick={modalClicked} className="absolute w-full h-full bg-black z-70 opacity-50 visible"></div>
    )
}
