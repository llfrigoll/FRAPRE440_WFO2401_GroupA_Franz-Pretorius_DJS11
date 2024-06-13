import { useState, useEffect } from "react"
import { fetchPodcasts, getGenres } from "../utils/Api"
import {Preview, Show, Season, Episode, Genre} from '../utils/interfaces'

export default function Shows() {
    const [podcasts, setPodcasts] = useState<Show[]>([])
    const [genres, setGenres] = useState<Genre[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        async function loadPodcasts() {
            setLoading(true)
            try {
                const podcastsData = await fetchPodcasts()
                setPodcasts(podcastsData)
                const genresData = await getGenres()
                setGenres(genresData)
            } catch (err: any) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        loadPodcasts()
    }, [])

    if (loading) {
        return <h1>Loading...</h1>
    }
    
    if (error) {
        return <h1>There was an error: {error.message}</h1>
    }

    const singleGenre = genres.map(genre =>(
        <div key={genre.id} className="genre-title">
            <p>{genre.title}</p>
         </div>
    ))
    return (
        <div>{singleGenre}</div>
    )

    // const singlepodcast = podcasts.map(podcast => (
    //     <div key={podcast.id} className="podcast-description">
    //         <p>{podcast.description}</p>
    //     </div>
    // ))
    // return (
    //     <div>{singlepodcast}</div>
    // )
}