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
  const [podcast, setPodcast] = useState<Show | undefined>(undefined);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [activePreview, setActivePreview] = useState<Preview | undefined>(undefined);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(false);
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [genreString, setGenreString] = useState<string>('');

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

  // Fetch show and previews
  useEffect(() => {
    async function loadShowAndPreviews() {
      setLoading(true);
      const showData = await getShow(showId);
      setPodcast(showData);

      const previewsData = await getAllPreviews();
      setPreviews(previewsData);

      const localPreviews = previewsData.filter(preview => preview.id === showId);
      const preview = localPreviews[0];
      setActivePreview(preview);

      if (showData) {
        setSeasons(showData.seasons);
      }
      setLoading(false);
    }
    loadShowAndPreviews();
  }, [showId]);

  // Fetch genres and update genre string
  useEffect(() => {
    async function loadGenres() {
      setLoading(true)
      const allGenres = await getGenres();
      setAllGenres(allGenres);

      if (activePreview && allGenres.length > 0) {
        const genreNames = activePreview.genres.map(genreId => {
          const genre = allGenres.find(genre => genre.id === genreId);
          return genre ? genre.title : '';
        }).filter(title => title); // Filter out any undefined values
        setGenreString(genreNames.join(', '));
      }
      setLoading(false)
    }
    loadGenres();
  }, [activePreview]);

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
        <div className="flex flex-col col-span-2 bg-white rounded-lg w-full">
          <button className="ml-2 mt-2 mr-auto font-medium">{'< Back'}</button>
          {loading && <LoadIcon />}
          {!loading && (
            <div className="col-span-1 w-full ml-4 mt-2 p-2">
              <div className="flex flex-row w-full">
                <img src={podcast?.image} className="rounded-md w-1/4" alt={podcast?.title} />
                <div className="flex flex-col w-3/4 border border-red-500 border-solid">
                  <h1 className="text-slate-800 font-bold text-3xl pl-4 w-3/4 text-wrap">{podcast?.title}</h1>
                  <p>Genres: {genreString}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-span-1 bg-white rounded-lg relative">
          <button onClick={closeClickHandler} className="absolute top-2 right-4 font-medium text-slate-800">Close x</button>
          {loading && <LoadIcon />}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
