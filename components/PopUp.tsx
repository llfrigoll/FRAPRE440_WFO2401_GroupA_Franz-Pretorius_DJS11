import React from "react";
import { Preview } from '../utils/interfaces';

interface PopUpProps {
  show: Preview;
}

export default function PopUp({ show }: PopUpProps) {
  return (
    <div className="fixed top-1/4 left-1/4 w-1/2 h-1/2 bg-white z-50">
      <h1>{show.title}</h1>
      {/* Add more details as needed */}
    </div>
  );
}
