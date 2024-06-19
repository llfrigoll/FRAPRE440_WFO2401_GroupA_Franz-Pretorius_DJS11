import React, { useCallback, useEffect, useState } from "react"
import { Preview } from "../utils/interfaces";
import Filters from "../components/Filters";

interface FavouriteProps {
    handleNav: (value: boolean) => void
}

export default function Favourites({handleNav}: FavouriteProps) {
    const [sortFunction, setSortFunction] = useState<(a: Preview, b: Preview) => number>(() => () => 0);
    const [favEpisodeStrings, setFavEpisodeStrings] = useState<(string | null)[]>([])
    const [favEpisodes, setFavEpisodes] = useState<(FavObject | null)[]>([])
    const [displayItems, setDisplayItems] = useState<DisplayShow[]>([])

    interface FavObject {
        showdId: string,
        seasonNum: number,
        episodeNum: number,
        dateAdded: Date
    }

    interface DisplayShow {
        showId: string
        season: DisplaySeason[]
    }

    interface DisplaySeason {
        seasonNum: number
        episodes: DisplayEpisode[]
    }

    interface DisplayEpisode {
        episodeNum: number
        dateAdded: Date
    }

    useEffect(() => {
        async function loadLocalStorage() {
            let localEpisodes: (string | null)[] = []
            Object.keys(localStorage).forEach(function(key){
                if(!key.endsWith('_audio')) {
                    localEpisodes.push(localStorage.getItem(key))
                }
            })
            setFavEpisodeStrings([...localEpisodes])
        }
        loadLocalStorage()
    },[localStorage.length])

    useEffect(() => {
        async function loadEpisodes() {
               const newFavEpisodes: FavObject[] = favEpisodeStrings.map(episode => episode ? JSON.parse(episode) : null)
            setFavEpisodes([...newFavEpisodes])
        }
        loadEpisodes()
    }, [favEpisodeStrings])

    useEffect(() => {
        async function createDisplayShows() {
            let items: DisplayShow[] = []

            let numOfShows: number = 0
            let showIds: (string | null)[] = []
            let show: string | null = ''

            favEpisodes.forEach((episode, index) => {
                if(index === 0) {
                    show = episode?.showdId !== undefined ? episode.showdId : null
                    showIds.push(show)
                    numOfShows++
                }else {
                    if(episode?.showdId !== show){
                        show = episode?.showdId !== undefined ? episode.showdId : null
                        showIds.push(show)
                        numOfShows++
                    }   
                }
            })


        }
        createDisplayShows()
    }, [favEpisodes])


    const handleSortChange = (sortFunc: (a: Preview, b: Preview) => number) => {
        setSortFunction(() => sortFunc);
    };

    return (
        <div data-ref="favourites-container" className="pt-20 bg-slate-300 min-h-screen border border-purple-500 border-solid">
            <div className="flex flex-row">
                <h1 className="text-slate-600 font-semibold text-3xl ml-20 pt-10 mt-auto mb-auto">Favourites</h1> 
            </div>
        </div>
    )
}