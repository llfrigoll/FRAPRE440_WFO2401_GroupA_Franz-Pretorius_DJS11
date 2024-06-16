import React, { useEffect, useState } from "react";
import { Episode, Preview, Season, Show } from '../utils/interfaces';
import { getShow } from "../utils/Api";

interface PopUpProps {
  showId: string;
}

export default function PopUp({ showId }: PopUpProps) {
  const [podcast, setPodcast] = useState<Show | null>(null)
  const [seasons, setSeasons] = useState<Season[]>([])

  useEffect(() => {
    async function loadShow() {
      const showData = await getShow(showId)
      setPodcast(showData)
      if(podcast) {
        let allSeasons: Season[] = []
        podcast.seasons.forEach(season => {
          allSeasons.push(season)
        })
        setSeasons(allSeasons)
      }
    }
    loadShow();
}, []);




  return (
    <div className="fixed top-1/4 left-1/4 w-1/2 h-1/2 bg-white z-50 grid grid-cols-2">
      <h1>{podcast?.title}</h1>
      {/* Add more details as needed */}
    </div>
  );
}
