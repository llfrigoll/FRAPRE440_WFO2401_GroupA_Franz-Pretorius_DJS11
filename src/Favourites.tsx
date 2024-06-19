import React, { useEffect, useState } from "react";
import { Preview } from "../utils/interfaces";
import Filters from "../components/Filters";

interface FavouriteProps {
    handleNav: (value: boolean) => void;
}

export default function Favourites({ handleNav }: FavouriteProps) {
    const [sortFunction, setSortFunction] = useState<(a: Preview, b: Preview) => number>(() => () => 0);
    const [favEpisodeStrings, setFavEpisodeStrings] = useState<(string | null)[]>([]);
    const [favEpisodes, setFavEpisodes] = useState<(FavObject | null)[]>([]);
    const [displayItems, setDisplayItems] = useState<DisplayShow[]>([]);

    interface FavObject {
        showdId: string;
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
                    console.error(`Error parsing JSON for episode: ${episode}`, e);
                    return null;
                }
            });
            setFavEpisodes([...newFavEpisodes]);
        }
        loadEpisodes();
    }, [favEpisodeStrings]);

    useEffect(() => {
        function createDisplayShows() {
            console.log("Creating display shows with favEpisodes:", favEpisodes);
            let items: DisplayShow[] = [];

            favEpisodes.forEach((episode) => {
                if (episode) {
                    let show = items.find(item => item.showId === episode.showdId);
                    if (!show) {
                        show = { showId: episode.showdId, seasons: [] };
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

            console.log("Final display items:", items);
            setDisplayItems([...items]);
        }
        createDisplayShows();
    }, [favEpisodes]);

    console.log("Display items state:", displayItems);

    const handleSortChange = (sortFunc: (a: Preview, b: Preview) => number) => {
        setSortFunction(() => sortFunc);
    };

    return (
        <div data-ref="favourites-container" className="pt-20 bg-slate-300 min-h-screen border border-purple-500 border-solid">
            <div className="flex flex-row">
                <h1 className="text-slate-600 font-semibold text-3xl ml-20 pt-10 mt-auto mb-auto">Favourites</h1>
            </div>
        </div>
    );
}
