import React, { ReactHTMLElement, useEffect, useState } from "react";
import { Preview } from "../utils/interfaces";
import Filters from "../components/Filters";
import { getEpisode, getSeason, getShow } from "../utils/Api";

interface FavouriteProps {
    handleNav: (value: boolean) => void;
}

export default function Favourites({ handleNav }: FavouriteProps) {
    const [sortFunction, setSortFunction] = useState<(a: Preview, b: Preview) => number>(() => () => 0);
    const [favEpisodeStrings, setFavEpisodeStrings] = useState<(string | null)[]>([]);
    const [favEpisodes, setFavEpisodes] = useState<(FavObject | null)[]>([]);
    const [displayItems, setDisplayItems] = useState<DisplayShow[]>([]);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

    interface FavObject {
        showId: string;
        seasonNum: number;
        episodeNum: number;
        dateAdded: Date;
    }

    interface DisplayShow {
        showId: string;
        seasons: DisplaySeason[];
    }

    interface DisplaySeason {
        seasonNum: number;
        episodes: DisplayEpisode[];
    }

    interface DisplayEpisode {
        episodeNum: number;
        dateAdded: Date;
    }

    useEffect(() => {
        async function loadLocalStorage() {
            let localEpisodes: (string | null)[] = [];
            Object.keys(localStorage).forEach(function (key) {
                if (!key.endsWith('_audio')) {
                    localEpisodes.push(localStorage.getItem(key));
                }
            });
            setFavEpisodeStrings([...localEpisodes]);
        }
        loadLocalStorage();
    }, [localStorage.length]);

    useEffect(() => {
        async function loadEpisodes() {
            const newFavEpisodes: (FavObject | null)[] = favEpisodeStrings.map(episode => {
                try {
                    return episode ? JSON.parse(episode) : null;
                } catch (e) {
                    return
                }
            });
            setFavEpisodes([...newFavEpisodes.filter(episode => episode !== undefined)]);
        }
        loadEpisodes();
    }, [favEpisodeStrings]);

    useEffect(() => {
        function createDisplayShows() {
            let items: DisplayShow[] = [];
    
            favEpisodes.forEach((episode) => {
                if (episode) {
                    // Find the show in items, or create a new one if it doesn't exist
                    let show = items.find(item => item.showId === episode.showId);
                    if (!show) {
                        show = { showId: episode.showId, seasons: [] };
                        items.push(show);
                    }
    
                    // Find the season in show, or create a new one if it doesn't exist
                    let season = show.seasons.find(season => season.seasonNum === episode.seasonNum);
                    if (!season) {
                        season = { seasonNum: episode.seasonNum, episodes: [] };
                        show.seasons.push(season);
                    }
    
                    // Create the episode
                    const displayEpisode: DisplayEpisode = {
                        episodeNum: episode.episodeNum,
                        dateAdded: episode.dateAdded,
                    };
    
                    // Add the episode to the season
                    season.episodes.push(displayEpisode);
                }
            });
    
            setDisplayItems([...items]);
        }
        createDisplayShows();
    }, [favEpisodes]);

    useEffect(() => {
        async function fetchAndDisplayShows() {
            displayItems.forEach(async show => {
                const showData = await getShow(show.showId)
                const showImage = showData.image
                const showTitle = showData.title
                const numOfSeasons = showData.seasons.length
                const lastUpdatedDate = new Date(showData.updated)
                const lastUpdatedString = `${lastUpdatedDate.getDate()} ${months[lastUpdatedDate.getMonth()]} ${lastUpdatedDate.getFullYear()}`

                

                show.seasons.forEach(async season => {
                    const seasonData = await getSeason(show.showId, season.seasonNum)
                    const seasonTitle = `Season ${season.seasonNum}`

                    season.episodes.forEach(async episode => {
                        const episodeData = await getEpisode(seasonData, episode.episodeNum)
                        const episodeAdded = new Date(episode.dateAdded)
                        const episodeTitle = `${episode.episodeNum}. ${episodeData.title} Added on ${episodeAdded.getDate()} ${months[episodeAdded.getMonth()]} ${episodeAdded.getFullYear()}`
                    })
                })
            })
        }
        fetchAndDisplayShows()
    },[displayItems])
    

    const handleSortChange = (sortFunc: (a: Preview, b: Preview) => number) => {
        setSortFunction(() => sortFunc);
    };

    return (
        <div data-ref="favourites-container" className="pt-20 bg-slate-300 min-h-screen">
            <div className="flex flex-row">
                <h1 className="text-slate-600 font-semibold text-3xl ml-20 pt-10 mt-auto mb-auto">Favourites</h1>
            </div>
            <div className="grid grid-cols-2 gap-10 mt-10 mx-14 border border-purple-500 border-solid">
                <div className="w-30 h-30 bg-white">hi</div>
                <div className="w-30 h-30 bg-white">hey</div>
                <div className="w-30 h-30 bg-white">hello</div>
            </div>
        </div>
    );
}
