import React, { useEffect, useState } from "react";
import { Episode, Preview, Season, Show } from '../utils/interfaces';
import { getGenres, getShow, getSinglePreview } from "../utils/Api";
import { AnimatePresence, motion } from "framer-motion";
import LoadIcon from "./LoadIcon";

interface PopUpProps {
  showId: string;
  hidepopup: () => void
  closeModal: (value: boolean) => void
}

export default function PopUp({ showId, hidepopup, closeModal }: PopUpProps) {
  const [podcast, setPodcast] = useState<Show | null>(null)
  const [seasons, setSeasons] = useState<Season[]>([])
  const [loading, setLoading] = useState(false)
  const [genreString, setGenreString] = useState<String | null>('')

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
      setLoading(true)
      const showData = await getShow(showId)
      setPodcast(showData)
      const previewData = await getSinglePreview(showId)
      let allGenres = await getGenres()
      if(previewData) {
        const filteredGenres = allGenres.filter((genre) => podcast?.genres.map(genreId => genreId === genre.id))
        const genreNames = filteredGenres.map(genre => genre.title)
        genreNames.length > 1 ? setGenreString(genreNames?.join(', ')) : setGenreString(genreNames[0])
      }
      if(podcast) {
        let allSeasons: Season[] = []
        podcast.seasons.forEach(season => {
          allSeasons.push(season)
        })
        setSeasons(allSeasons)
      }
      setLoading(false)
    }
    loadShow();
}, []);

const closeClickHandler = () => {
  hidepopup()
  closeModal(false)
}


  
  return (
    <AnimatePresence>
      (<motion.div
      className="fixed top-32 left-48  w-3/4 h-2/3 bg-transparent z-50 grid grid-cols-3 gap-3"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={popUpContainer}>
        <div className="flex flex-col col-span-2 bg-white rounded-lg w-full">
          <button className="ml-2 mt-2 mr-auto font-medium col-span-2">{'< Back'}</button>
          <>{loading ? <LoadIcon/> : <></>}</>
          <div className="col-span-1 w-full ml-4 mt-2 p-2">
            <div className="flex flex-row w-full">
              <img src={podcast?.image} className="rounded-md w-1/4" alt={podcast?.title} />
              <div className="flex flex-col w-3/4 border border-red-500 border-solid">
                <h1 className="text-slate-800 font-bold text-3xl pl-4 w-3/4 text-wrap">{podcast?.title}</h1>
                <p>Genres: {genreString}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1 bg-white rounded-lg">
          <button onClick={closeClickHandler} className="absolute mt-2 right-4 font-medium text-slate-800">Close x</button>
          <>{loading ? <LoadIcon/> : <></>}</>
        </div>
      </motion.div>)
    </AnimatePresence>
  );
}
