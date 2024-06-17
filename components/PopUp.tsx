import React, { useEffect, useState } from "react";
import { Episode, Genre, Preview, Season, Show } from '../utils/interfaces';
import { getAllPreviews, getGenres, getShow } from "../utils/Api";
import { AnimatePresence, motion } from "framer-motion";
import LoadIcon from "./LoadIcon";

interface PopUpProps {
  showId: string;
  hidepopup: () => void;
  closeModal: (value: boolean) => void;
}

export default function PopUp({ showId, hidepopup, closeModal }: PopUpProps) {
  const [podcast, setPodcast] = useState<Show | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(false);
  const [genreString, setGenreString] = useState<string>('');
  const [updatedString, setUpdatedString] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
      const showData = await getShow(showId);
      setPodcast(showData);
      setLoading(false)
    }
    loadShow();
  }, [showId]);

  useEffect(() => {
    async function loadInfo() {
      if (podcast) {
        setSeasons(podcast.seasons);
        podcast.genres ? setGenreString('Genres: ' + podcast.genres.join(', ')) : setGenreString('Genres: 🗿')

        const updatedDate = new Date(podcast.updated)
        const updated = `Last updated: ${updatedDate.getDate()} ${months[updatedDate.getMonth()]} ${updatedDate.getFullYear()}`
        setUpdatedString(updated)

        const descriptionString = `Description: ${podcast.description}`
        setDescription(descriptionString)

      }
    }
    loadInfo()
  },[podcast])

  const closeClickHandler = () => {
    hidepopup();
    closeModal(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-32 left-48 w-3/4 h-2/3 bg-transparent z-50 grid grid-cols-3 gap-3"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={popUpContainer}
      >
        <button className="fixed pl-4 pt-2 font-medium text-slate-300 z-10">{'< Back'}</button>
        <div className="flex flex-col col-span-2 bg-slate-800 rounded-lg w-full">
          {loading && <LoadIcon />}
          <div className="absolute top-10 left-2 right-96 mr-12 h-48 rounded-xl bg-slate-800"></div>
          {!loading && (
            <div className="col-span-2 w-full pl-6 pt-12 p-2">
              <img src={podcast?.image} className="fixed rounded-md h-1/4 col-span-1 z-10" alt={podcast?.title} />
              <div className="fixed flex flex-col col-span-1 w-3/4 pl-44">
                <h1 className="text-slate-300 font-semibold text-4xl pl-4 mb-2 w-3/4 text-wrap">{podcast?.title}</h1>
                <p className="pl-4 mb-1 text-slate-300">{genreString}</p>
                <p className="pl-4 mb-1 text-slate-300">{updatedString}</p>
                <p className="pl-4 mb-1 text-slate-300">{`Seasons: ${seasons.length}`}</p>
              </div>
            </div>
          )}
          <div className="col-span-2 pl-6 pt-44 pr-8 h-96">
            <div className="overflow-y-auto">
              <p className="h-48 mt-4 pr-4 text-sm text-slate-300">{description}</p>
            </div>
          </div>
        </div>
        <div className="col-span-1 bg-slate-600 rounded-lg relative">
          <button onClick={closeClickHandler} className="absolute top-2 right-4 font-medium text-slate-300">Close x</button>
          {loading && <LoadIcon />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
