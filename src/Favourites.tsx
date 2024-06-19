import React, { useEffect, useState } from "react";
import { Preview } from "../utils/interfaces";
import Filters from "../components/Filters";
import { getEpisode, getSeason, getShow } from "../utils/Api";
import LoadIcon from "../components/LoadIcon";

interface FavouriteProps {
    handleNav: (value: boolean) => void;
}

interface FavObject {
    showId: string;
    seasonNum: number;
    episodeNum: number;
    dateAdded: string; // Using string instead of Date for localStorage compatibility
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
    dateAdded: string;
}

export default function Favourites({ handleNav }: FavouriteProps) {
    const [sortFunction, setSortFunction] = useState<(a: Preview, b: Preview) => number>(() => () => 0);
    const [favEpisodeStrings, setFavEpisodeStrings] = useState<(string | null)[]>([]);
    const [favEpisodes, setFavEpisodes] = useState<(FavObject | null)[]>([]);
    const [displayItems, setDisplayItems] = useState<DisplayShow[]>([]);
    const [renderedShows, setRenderedShows] = useState<JSX.Element[]>([]);
    const [loading, setLoading] = useState(false);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        async function loadLocalStorage() {
            const localEpisodes: (string | null)[] = [];
            Object.keys(localStorage).forEach((key) => {
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
                    return episode ? JSON.parse(episode) as FavObject : null;
                } catch (e) {
                    return null;
                }
            });
            setFavEpisodes(newFavEpisodes.filter(episode => episode !== null));
        }
        loadEpisodes();
    }, [favEpisodeStrings]);

    useEffect(() => {
        function createDisplayShows() {
            const items: DisplayShow[] = [];

            favEpisodes.forEach((episode) => {
                if (episode) {
                    let show = items.find(item => item.showId === episode.showId);
                    if (!show) {
                        show = { showId: episode.showId, seasons: [] };
                        items.push(show);
                    }

                    let season = show.seasons.find(season => season.seasonNum === episode.seasonNum);
                    if (!season) {
                        season = { seasonNum: episode.seasonNum, episodes: [] };
                        show.seasons.push(season);
                    }

                    const displayEpisode: DisplayEpisode = {
                        episodeNum: episode.episodeNum,
                        dateAdded: episode.dateAdded,
                    };

                    season.episodes.push(displayEpisode);
                }
            });

            setDisplayItems(items);
        }
        createDisplayShows();
    }, [favEpisodes]);

    async function fetchAndDisplayShows() {
        setLoading(true)
        const elements: JSX.Element[] = [];

        for (const show of displayItems) {
            const showData = await getShow(show.showId);
            const showImage = showData.image;
            const showTitle = showData.title;
            const numOfSeasons = showData.seasons.length;
            const lastUpdatedDate = new Date(showData.updated);
            const lastUpdatedString = `${lastUpdatedDate.getDate()} ${months[lastUpdatedDate.getMonth()]} ${lastUpdatedDate.getFullYear()}`;

            const seasonElements: JSX.Element[] = [];
            for (const season of show.seasons) {
                const seasonData = await getSeason(show.showId, season.seasonNum);
                const seasonTitle = `Season ${season.seasonNum}`;

                const episodeElements: JSX.Element[] = [];
                for (const episode of season.episodes) {
                    const episodeData = await getEpisode(seasonData, episode.episodeNum);
                    const episodeAdded = new Date(episode.dateAdded);
                    const episodeTitle = `${episode.episodeNum}. ${episodeData.title} - Added: ${episodeAdded.getHours()}:${episodeAdded.getMinutes()}, ${episodeAdded.getDate()} ${months[episodeAdded.getMonth()]} ${episodeAdded.getFullYear()}`;
                    
                    episodeElements.push(
                        <li key={`${show.showId}-${season.seasonNum}-${episode.episodeNum}`} className="font-light">
                            <button className="text-red-500 pr-1 font-semibold hover:text-red-800">x</button> {episodeTitle}
                        </li>
                    );
                }

                seasonElements.push(
                    <div key={`${show.showId}-${season.seasonNum}`} className="pl-2 w-11/12 ">
                        <h3 className="text-lg font-medium">{seasonTitle}</h3>
                        <ul className="pb-2">
                            {episodeElements}
                        </ul>
                    </div>
                    
                );
            }

            elements.push(
                <div data-ref="show-container" className="mb-12">
                    <div key={show.showId} className="flex flex-row">
                        <img className="h-44 w-44 mb-4 self-center rounded-lg" src={showImage} alt={`${showTitle} image`} />
                        <div className="flex flex-col pl-4 pt-2">
                            <h2 className="text-2xl font-semibold mb-3">{showTitle}</h2>
                            <p className="mb-1">Number of Seasons: {numOfSeasons}</p>
                            <p>Last Updated: {lastUpdatedString}</p>
                        </div>
                    </div>
                    <hr className="mb-2 ml-1 w-11/12 border-slate-800" />
                    {seasonElements}
                </div>
            );
        }
        setRenderedShows(elements);
        setLoading(false)
    }

    useEffect(() => {
        fetchAndDisplayShows();
    }, [displayItems]);

    const handleSortChange = (sortFunc: (a: Preview, b: Preview) => number) => {
        setSortFunction(() => sortFunc);
    };

    const propsColor = 'border-slate-800'
    if (loading) {
        return (
            <div data-ref="dashboard-container" className="pt-20">
                <LoadIcon iconColor ={propsColor}/>
            </div>
        );
    }

    return (
        <div data-ref="favourites-container" className="pt-20 bg-slate-300 min-h-screen">
            <div className="flex flex-row">
                <h1 className="text-slate-600 font-semibold text-4xl ml-20 pt-10 mt-auto mb-auto">Favourites</h1>
                <span className="text-slate-800 ml-auto mr-40 pt-10 mt-auto mb-auto font-medium">
                    <button className="hover:text-light hover:text-slate-400">A-Z</button>
                    <button className="hover:text-light hover:text-slate-400 ml-10">Z-A</button>
                    <button className="hover:text-light hover:text-slate-400 ml-10">Newest</button>
                    <button className="hover:font-light hover:text-slate-400 ml-10">Oldest</button>
                </span>
            </div>
            <div className="grid grid-cols-2 gap-x-10 mt-10 mx-14 text-slate-800">
                {renderedShows}
            </div>
        </div>
    );
}
