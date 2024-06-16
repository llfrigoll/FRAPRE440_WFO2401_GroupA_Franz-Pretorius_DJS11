import React from "react"

interface ModalProps {
    handleModal: (value: boolean) => void;
  }

export default function Modal({handleModal}: ModalProps) {
    function modalClicked() {
        handleModal(false)
    }

    return (
        <div onClick={modalClicked} className="absolute w-full h-full bg-black z-70 opacity-50 visible"></div>
    )
}