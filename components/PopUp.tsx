import React from "react";
import { Preview } from '../utils/interfaces';

interface PopUpProps {
  show: Preview;
}

export default function PopUp({ show }: PopUpProps) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-white z-50">
      <h1>{show.title}</h1>
      {/* Add more details as needed */}
    </div>
  );
}
