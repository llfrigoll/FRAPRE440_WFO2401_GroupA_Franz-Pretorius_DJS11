import React, { useEffect, useState } from "react";
import { Preview } from "../utils/interfaces";
import Filters from "../components/Filters";
import { getEpisode, getSeason, getShow } from "../utils/Api";

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
                    const episodeTitle = `${episode.episodeNum}. ${episodeData.title} Added on ${episodeAdded.getDate()} ${months[episodeAdded.getMonth()]} ${episodeAdded.getFullYear()}`;
                    
                    episodeElements.push(
                        <li key={`${show.showId}-${season.seasonNum}-${episode.episodeNum}`}>
                            {episodeTitle}
                        </li>
                    );
                }

                seasonElements.push(
                    <div key={`${show.showId}-${season.seasonNum}`}>
                        <h3>{seasonTitle}</h3>
                        <ul>
                            {episodeElements}
                        </ul>
                    </div>
                );
            }

            elements.push(
                <div key={show.showId} className="show-container">
                    <img src={showImage} alt={`${showTitle} poster`} />
                    <h2>{showTitle}</h2>
                    <p>Number of Seasons: {numOfSeasons}</p>
                    <p>Last Updated: {lastUpdatedString}</p>
                    {seasonElements}
                </div>
            );
        }

        setRenderedShows(elements);
    }

    useEffect(() => {
        fetchAndDisplayShows();
    }, [displayItems]);

    const handleSortChange = (sortFunc: (a: Preview, b: Preview) => number) => {
        setSortFunction(() => sortFunc);
    };

    return (
        <div data-ref="favourites-container" className="pt-20 bg-slate-300 min-h-screen">
            <div className="flex flex-row">
                <h1 className="text-slate-600 font-semibold text-3xl ml-20 pt-10 mt-auto mb-auto">Favourites</h1>
            </div>
            <div className="grid grid-cols-2 gap-10 mt-10 mx-14 border border-purple-500 border-solid">
                {renderedShows}
            </div>
        </div>
    );
}
