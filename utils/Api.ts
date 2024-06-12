import { useState, useEffect } from "react"
import {Preview, Show, Season, Episode, Genre} from './interfaces'

export default function apiSetup() {
    const [podcastIds, setPodcastIds] = useState<string[]>([])
    const [podcasts, setPodcasts] = useState<Show[]>([])
    const [LoadedPodcasts, setLoadedPodcasts] = useState(false)
    const [PodcastErrMsg, setPodcastErrMsg] = useState('')
    let podcastArray: Show[] = []

    useEffect(() => {
        const fetchPodcasts = async () => {
            try {
                let response = await fetch('https://podcast-api.netlify.app')
                if (!response.ok) {
                    throw new Error('Could not fetch podcast Ids')
                }
                const previews = await response.json()

                const podcastIdArray = previews.map((podcast: Preview) => podcast.id)
                setLoadedPodcasts(true)
                setPodcastIds(podcastIdArray)

                for(let i = 0; i < podcastIds.length; i++) {
                    const response = await fetch(`https://podcast-api.netlify.app/id/${podcastIds[i]}`)
                    if (!response.ok) {
                        throw new Error('Could not fetch podcasts')
                    }
                    const podcast = await response.json()
                    podcastArray.push(podcast)
                    setLoadedPodcasts(true)
                }
                setPodcasts(podcastArray)
            } catch (error: any) {
                setLoadedPodcasts(false)
                setPodcastErrMsg(error.message)
            }
        }
        fetchPodcasts()
    }, [])

    return podcasts
}