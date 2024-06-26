import React, { useEffect, useState } from 'react'
import { getEpisode, getSeason, getShow } from '../utils/Api'
import LoadIcon from '../components/LoadIcon'

interface FavObject {
    showId: string
    seasonNum: number
    episodeNum: number
    dateAdded: Date
}

interface DisplayShow {
    showId: string
    title: string
    seasons: DisplaySeason[]
    updated: string
}

interface DisplaySeason {
    seasonNum: number
    episodes: DisplayEpisode[]
}

interface DisplayEpisode {
    episodeNum: number
    dateAdded: string
}

export default function Favourites() {
    const [favEpisodeStrings, setFavEpisodeStrings] = useState<
        (string | null)[]
    >([])
    const [favEpisodes, setFavEpisodes] = useState<(FavObject | null)[]>([])
    const [displayItems, setDisplayItems] = useState<DisplayShow[]>([])
    const [renderedShows, setRenderedShows] = useState<JSX.Element[]>([])
    const [loading, setLoading] = useState(false)
    const [isRemoveClicked, setIsRemovedClicked] = useState(false)
    const [isRemoveAllClicked, setIsRemovedAllClicked] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState<string>('')

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    //Loads the favourites from localstorage using unique id
    useEffect(() => {
        async function loadLocalStorage() {
            setSelectedFilter('')
            const localEpisodes: (string | null)[] = []
            Object.keys(localStorage).forEach(key => {
                //if statement filtering out other localstorage items that aren't favourites
                if (!key.endsWith('_audio') && !key.endsWith('_ended')) {
                    localEpisodes.push(localStorage.getItem(key))
                }
            })
            setFavEpisodeStrings([...localEpisodes])
        }
        loadLocalStorage()
    }, [isRemoveClicked, isRemoveAllClicked])

    //Loading the episodes and storing them as FavObjects
    useEffect(() => {
        async function loadEpisodes() {
            const newFavEpisodes: (FavObject | null)[] = favEpisodeStrings.map(
                episode => {
                    try {
                        return episode
                            ? (JSON.parse(episode) as FavObject)
                            : null
                    } catch (e) {
                        return null
                    }
                }
            )
            setFavEpisodes(newFavEpisodes.filter(episode => episode !== null))
        }
        loadEpisodes()
    }, [favEpisodeStrings])

    //Using FavObjects to create objects that are then readable for display
    useEffect(() => {
        async function createDisplayShows() {
            const items: DisplayShow[] = []

            //Uses unique id to get all shows
            for (const episode of favEpisodes) {
                if (episode) {
                    let show = items.find(
                        item => item.showId === episode.showId
                    )
                    if (!show) {
                        const showData = await getShow(episode.showId)
                        show = {
                            showId: episode.showId,
                            title: showData.title,
                            seasons: [],
                            updated: showData.updated.toString(),
                        }
                        items.push(show)
                    }

                    //Uses show to get all seasons
                    let season = show.seasons.find(
                        season => season.seasonNum === episode.seasonNum
                    )
                    if (!season) {
                        season = { seasonNum: episode.seasonNum, episodes: [] }
                        show.seasons.push(season)
                    }

                    //Uses show and season to get episodes
                    const displayEpisode: DisplayEpisode = {
                        episodeNum: episode.episodeNum,
                        dateAdded: episode.dateAdded.toString(),
                    }

                    season.episodes.push(displayEpisode)
                }
            }
            setDisplayItems(items)
        }
        createDisplayShows()
    }, [favEpisodes])

    //Uses the DisplayShow objects to fetch data from api and display it
    async function fetchAndDisplayShows() {
        setLoading(true)
        const elements: JSX.Element[] = []

        for (const show of displayItems) {
            const showData = await getShow(show.showId)
            const showImage = showData.image
            const showTitle = showData.title
            const numOfSeasons = showData.seasons.length
            const lastUpdatedDate = new Date(show.updated)
            const lastUpdatedString = `${lastUpdatedDate.getDate()} ${
                months[lastUpdatedDate.getMonth()]
            } ${lastUpdatedDate.getFullYear()}`

            //Sorts by season number
            show.seasons.sort((a, b) => a.seasonNum - b.seasonNum)
            const seasonElements: JSX.Element[] = []
            for (const season of show.seasons) {
                const seasonData = await getSeason(
                    show.showId,
                    season.seasonNum
                )
                const seasonTitle = `Season ${season.seasonNum}`

                const episodeElements: JSX.Element[] = []

                //Sorts by episode number
                season.episodes.sort((a, b) => a.episodeNum - b.episodeNum)
                for (const episode of season.episodes) {
                    const episodeData = await getEpisode(
                        seasonData,
                        episode.episodeNum
                    )
                    const episodeAdded = new Date(episode.dateAdded)
                    const episodeTitle = `${episode.episodeNum}. ${
                        episodeData.title
                    } - Added: ${episodeAdded
                        .getHours()
                        .toString()
                        .padStart(
                            2,
                            '0'
                        )}:${episodeAdded.getMinutes()}, ${episodeAdded.getDate()} ${
                        months[episodeAdded.getMonth()]
                    } ${episodeAdded.getFullYear()}`

                    episodeElements.push(
                        <li
                            id={`${show.showId}_${season.seasonNum}_${episode.episodeNum}`}
                            key={`${show.showId}-${season.seasonNum}-${episode.episodeNum}`}
                            className="font-light">
                            <button
                                onClick={handleRemove}
                                className="text-red-500 pr-1 font-semibold hover:text-red-800">
                                x
                            </button>{' '}
                            {episodeTitle}
                        </li>
                    )
                }

                seasonElements.push(
                    <div
                        key={`${show.showId}-${season.seasonNum}`}
                        className="pl-2 w-11/12">
                        <h3 className="text-lg font-medium">{seasonTitle}</h3>
                        <ul className="pb-2">{episodeElements}</ul>
                    </div>
                )
            }

            elements.push(
                <div
                    key={show.showId}
                    data-ref="show-container"
                    className="mb-12">
                    <hr className="mb-2 ml-1 pb-10 w-11/12 border-slate-800" />
                    <div className="flex flex-row w-11/12 ">
                        <img
                            className="h-44 w-44 mb-4 self-center rounded-lg"
                            src={showImage}
                            alt={`${showTitle} image`}
                        />
                        <div className="flex flex-col pl-4 pt-2">
                            <h2 className="text-2xl font-semibold mb-3">
                                {showTitle}
                            </h2>
                            <p className="mb-1">
                                Number of Seasons: {numOfSeasons}
                            </p>
                            <p>Last Updated: {lastUpdatedString}</p>
                        </div>
                    </div>
                    {seasonElements}
                </div>
            )
        }
        setRenderedShows(elements)
        setLoading(false)
    }

    //Rerenders every time the items array containing displayable items change
    useEffect(() => {
        fetchAndDisplayShows()
    }, [displayItems])

    //Removes the chosen episode
    function handleRemove(event: React.MouseEvent<HTMLButtonElement>) {
        const localStorageItem =
            event.currentTarget.parentElement?.getAttribute('id')
        if (localStorageItem) {
            localStorage.removeItem(localStorageItem)
            setIsRemovedClicked(!isRemoveClicked)
        }
    }

    //Checks the chosen sort and applies correct sorting method to the array
    function handleSort(event: React.MouseEvent<HTMLButtonElement>) {
        const filterChosen = event.currentTarget.innerText
        setSelectedFilter(filterChosen)

        if (filterChosen) {
            switch (filterChosen) {
                case 'A-Z': {
                    const sortedItems = [...displayItems].sort((a, b) => {
                        return a.title.localeCompare(b.title, undefined, {
                            numeric: true,
                        })
                    })
                    setDisplayItems(sortedItems)
                    break
                }
                case 'Z-A': {
                    const sortedItems = [...displayItems].sort((a, b) => {
                        return b.title.localeCompare(a.title, undefined, {
                            numeric: true,
                        })
                    })
                    setDisplayItems(sortedItems)
                    break
                }
                case 'Newest': {
                    const sortedItems = [...displayItems].sort((a, b) => {
                        const dateA = new Date(a.updated)
                        const dateB = new Date(b.updated)
                        return dateB.getTime() - dateA.getTime()
                    })
                    setDisplayItems(sortedItems)
                    break
                }
                case 'Oldest': {
                    const sortedItems = [...displayItems].sort((a, b) => {
                        const dateA = new Date(a.updated)
                        const dateB = new Date(b.updated)
                        return dateA.getTime() - dateB.getTime()
                    })
                    setDisplayItems(sortedItems)
                    break
                }
            }
        }
    }

    //Removes all favourites
    function handleRemoveAll() {
        if (confirm('Are you sure you want to clear all favourites?')) {
            Object.keys(localStorage).forEach(key => {
                if (!key.endsWith('_audio')) {
                    localStorage.removeItem(key)
                }
            })
            setIsRemovedAllClicked(!isRemoveAllClicked)
        }
    }

    //Loading state
    const propsColor = 'border-slate-800'
    if (loading) {
        return (
            <div data-ref="dashboard-container" className="pt-20">
                <LoadIcon iconColor={propsColor} />
            </div>
        )
    }

    return (
        <div
            data-ref="favourites-container"
            className="min-h-screen pt-20 bg-slate-300">
            <div className="flex flex-row pb-6">
                <h1 className="text-slate-600 font-semibold text-4xl ml-20 pt-10 mt-auto mb-auto">
                    Favourites
                </h1>
                <span className="text-slate-800 ml-auto mr-40 pt-10 mt-auto mb-auto font-medium">
                    <button
                        onClick={handleSort}
                        className={`hover:text-light hover:text-slate-400 ${
                            selectedFilter === 'A-Z' ? 'underline' : ''
                        }`}>
                        A-Z
                    </button>
                    <button
                        onClick={handleSort}
                        className={`hover:text-light hover:text-slate-400 ml-10 ${
                            selectedFilter === 'Z-A' ? 'underline' : ''
                        }`}>
                        Z-A
                    </button>
                    <button
                        onClick={handleSort}
                        className={`hover:text-light hover:text-slate-400 ml-10 ${
                            selectedFilter === 'Newest' ? 'underline' : ''
                        }`}>
                        Newest
                    </button>
                    <button
                        onClick={handleSort}
                        className={`hover:text-light hover:text-slate-400 ml-10 ${
                            selectedFilter === 'Oldest' ? 'underline' : ''
                        }`}>
                        Oldest
                    </button>
                </span>
            </div>
            {renderedShows.length === 0 ? (
                <p className="text-center font-medium">No favourites</p>
            ) : (
                <></>
            )}
            <div className="grid grid-cols-2 gap-x-10 mt-10 mx-14 text-slate-800">
                {renderedShows}
            </div>
            <div className="flex justify-end mr-24 pb-10">
                <button
                    onClick={handleRemoveAll}
                    className="p-1 text-red-600 font-semibold rounded-md border-2 border-red-600 border-soid hover:text-light hover:text-red-800 hover:border-red-800">
                    Clear All Favourites
                </button>
            </div>
        </div>
    )
}
