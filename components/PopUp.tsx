import React, { useEffect, useState } from "react";
import { Episode, Preview, Season, Show } from '../utils/interfaces';
import { getShow } from "../utils/Api";

interface PopUpProps {
  showId: string;
}

export default function PopUp({ showId }: PopUpProps) {
  const [podcast, setPodcast] = useState<Show | null>(null)
  const [seasons, setSeasons] = useState<Season[]>([])

  const popUpContainer = {
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
    <div className="fixed top-32 left-48  w-3/4 h-2/3 bg-transparent z-50 grid grid-cols-3 gap-3">
      <div className="col-span-2 bg-white rounded-lg">
        <button className="ml-2 mt-2 font-medium">{'<'}</button>
      </div>
      <div className="col-span-1 bg-white rounded-lg">
      
      </div>
    </div>
  );
}
