import React, { useEffect, useState } from "react";
import { Episode, Genre, Preview, Season, Show } from '../utils/interfaces';
import { getAllPreviews, getGenres, getShow } from "../utils/Api";
import { AnimatePresence, motion } from "framer-motion";
import LoadIcon from "./LoadIcon";
import Select, { StylesConfig, SingleValue } from 'react-select'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

interface PopUpProps {
  showId: string;
  hidepopup: () => void;
  closeModal: (value: boolean) => void;
}

interface OptionType {
  value: number;
  label: string;
}

export default function PopUp({ showId, hidepopup, closeModal }: PopUpProps) {
  const [podcast, setPodcast] = useState<Show | undefined>(undefined);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(false);
  const [genreString, setGenreString] = useState<string>('');
  const [updatedString, setUpdatedString] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [seasonNames, setSeasonNames] = useState<OptionType[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(-1)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [popUpImage, setPopUpImage] = useState<string>('')
  const [popUpTitle, setPopUpTitle] = useState<string>('')
  const [seasonString, setSeasonString] = useState<string>('')
  const [validSeason, setValidSeason] = useState(false)
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null)
  const [_, setRender] = useState(false);
  const forceUpdate = () => setRender(prev => !prev);

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

        const titleString = `${podcast.title}`
        setPopUpTitle(titleString)

        const imageString = `${podcast.image}`
        setPopUpImage(imageString)

        const updatedDate = new Date(podcast.updated)
        const updated = `Last updated: ${updatedDate.getDate()} ${months[updatedDate.getMonth()]} ${updatedDate.getFullYear()}`
        setUpdatedString(updated)

        const descriptionString = `Description: ${podcast.description}`
        setDescription(descriptionString)

      }
    }
    loadInfo()
  },[podcast])

  useEffect(() => {
    async function loadOptions() {
      const options = seasons.map(season => ({
        value: season.season,
        label: `Season ${season.season.toString()}: ${season.episodes.length} Episodes`
      }))
      setSeasonNames(options)
      const seasonStringLocal = `Seasons: ${seasons.length}`
      setSeasonString(seasonStringLocal)
    }
    loadOptions()
  }, [seasons])

  useEffect(() => {
    async function loadEpisodes() {
      let localEpisodes: Episode[] = []
      
      if(selectedSeason !== -1) {
        localEpisodes = [...seasons[selectedSeason - 1].episodes]
        setPopUpImage(seasons[selectedSeason - 1].image)
        setPopUpTitle(`${podcast?.title}: Season ${selectedSeason}`)
        setDescription('')
        setSeasonString('')
        setValidSeason(true)
        
      }else {
        localEpisodes = []
        if(podcast) {
          setPopUpImage(podcast.image)
          setPopUpTitle(podcast.title)
          setDescription(podcast.description)
          const seasonStringLocal = `Seasons: ${seasons.length}`
          setSeasonString(seasonStringLocal)
          setValidSeason(false)
        }
      }
      setEpisodes(localEpisodes)
    }
    loadEpisodes()
  }, [selectedSeason])

  const favouritesBtnClick = () => {
    if (!activeEpisode) return;

    const favObject = {
      showId: showId,
      seasonNum: selectedSeason,
      episodeNum: activeEpisode.episode,
    };

    const uniqueKey = `${showId}_${selectedSeason}_${activeEpisode.episode}`;
    const storedItem = localStorage.getItem(uniqueKey);
    
    if (storedItem) {
      localStorage.removeItem(uniqueKey);
    } else {
      localStorage.setItem(uniqueKey, JSON.stringify(favObject));
    }

    forceUpdate(); // Forces the component to re-render
  }

  const playHandler = (event: React.MouseEvent<HTMLAudioElement>) => {
  //   const currentAudio = event.currentTarget
  }

  let episodeEl = (<></>)
  if(activeEpisode) {
    const uniqueKey = `${showId}_${selectedSeason}_${activeEpisode.episode}`;
    const isFavourite = localStorage.getItem(uniqueKey) !== null;
    
    episodeEl =
    (
      <>
        <div className="w-full flex flex-col h-fit">
          <div className="flex flex-row">
            <button 
              onClick={favouritesBtnClick} 
              className={`text-3xl mb-auto h-10 w-8 hover:text-red-500 ${isFavourite ? 'text-red-500 text-xl' : 'text-white'}`}
            >
              {isFavourite ? '❤️' : '♡'}
            </button>
            <h1 className="text-slate-300 text-2xl mt-1 mb-2 w-11/12 pl-1">{activeEpisode.episode}. {activeEpisode.title}</h1>
          </div>
          <p className="w-11/12 ml-4 text-slate-300 text-sm font-light pr-4 mb-4">{activeEpisode.description}</p>
          <audio controls onPlay={playHandler} data-ref="audio-player" className="w-11/12 ml-4">
            <source src={activeEpisode.file} type="audio/mp3"/>
          </audio>
        </div>
      </>
    )
  }

  const closeClickHandler = () => {
    hidepopup();
    closeModal(false);
  };

  const customStyles: StylesConfig<OptionType, false> = {
    control: (provided) => ({
        ...provided,
        border: 'none',
        boxShadow: 'none',
        width: '100%',
        '&:hover': {
            border: 'none',
            color: "rgb(107, 114, 128)",
            cursor: "pointer",
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "rgb(30,41,59)",
        fontWeight: 500,
    })
  };

  const handleSeasonChange = (selectedOption: SingleValue<OptionType>) => {
    setSelectedSeason(selectedOption ? selectedOption.value : -1)
    setActiveEpisode(null)
  };


  const handleEpisodeClick = (activeEpisode: Episode) => {
    setActiveEpisode(activeEpisode)
  }

  const handleBackClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const backBtn = event.currentTarget 
    if(activeEpisode) {
      setActiveEpisode(null)
      return
    }

    if(selectedSeason) {
      setSelectedSeason(-1)
      backBtn.classList.add('hidden')
      return
    }
  }

  const propsColor = 'border-slate-400'

  let episodeButtons = (<></>)
  if(validSeason) {
    episodeButtons =
    (
      <>
        <h1 className="text-slate-300 text-3xl font-semibold self-center py-6">Episodes</h1>
        <div className="w-3/4 self-center grid grid-cols-2 gap-2">
          {episodes.map(episode => (
            <button key={episode.episode} onClick={() => handleEpisodeClick(episode)} className={"w-fit py-1 mx-auto z-10 hover:text-slate-800 " + (activeEpisode === episode ? 'text-slate-900' : 'text-slate-300')}>Episode {episode.episode}</button>
          ))}
        </div>
      </>
    )
  }


  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-32 left-48 w-3/4 h-2/3 bg-transparent z-50 grid grid-cols-3 gap-3"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={popUpContainer}
      >
        <button onClick={handleBackClick} className={'fixed pl-4 pt-2 font-medium text-slate-300 z-10 ' + ((selectedSeason) === -1 ? 'hidden' : 'visible')}>{'< Back'}</button>
        <div className="flex flex-col col-span-2 bg-slate-800 rounded-lg w-full">
          {loading && <LoadIcon iconColor ={propsColor}/>}
          <div className="absolute top-10 left-2 right-96 mr-12 h-48 rounded-xl bg-slate-800"></div>
          {!loading && (
            <div className="col-span-2 w-full pl-6 pt-12 p-2">
              <img src={popUpImage} className="fixed rounded-md h-1/4 col-span-1 z-10" alt={popUpTitle} />
              <div className="fixed flex flex-col col-span-1 w-1/3 ml-44">
                <h1 className="pl-4 mb-2 text-slate-300 font-semibold text-4xl text-wrap">{popUpTitle}</h1>
                <p className="pl-4 mb-1 text-slate-300 text-wrap">{genreString}</p>
                <p className="pl-4 mb-1 text-slate-300 text-wrap">{updatedString}</p>
                <p className="pl-4 mb-1 text-slate-300 text-wrap">{seasonString}</p>
              </div>
            </div>
          )}
          <div className="col-span-2 pl-6 pt-44 pr-8 h-96">
            <div className="overflow-y-auto h-full">
              {!activeEpisode && <p className="h-48 mt-4 pr-4 text-sm text-slate-300">{description}</p>}
              {activeEpisode && <>{episodeEl}</>}
            </div>
          </div>
        </div>
        <div className="col-span-1 bg-slate-600 rounded-lg">
          <button onClick={closeClickHandler} className="absolute top-2 right-4 font-medium text-slate-300 z-10">Close ✖</button>
          {loading && <LoadIcon iconColor ={propsColor}/>}
          {!loading && (
            <div className="flex flex-col mt-12">
              <div className="w-3/4 self-center z-20">
                <Select
                styles={customStyles}
                options={seasonNames}
                isClearable={true}
                placeholder="Seasons"
                onChange={handleSeasonChange}/>
              </div>
              <div className="flex flex-col items-start">
                {episodeButtons}
              </div>
            </div>
            )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
