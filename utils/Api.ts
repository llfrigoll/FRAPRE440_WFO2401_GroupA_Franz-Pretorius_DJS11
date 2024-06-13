import {Preview, Show, Season, Episode, Genre} from './interfaces'

export async function getGenres() {
    let genreArray: Genre[] = []
    let idCounter = 1
    let response = await fetch(`https://podcast-api.netlify.app/genre/${idCounter}`)
    if (!response.ok) {
        throw {
            message: "Failed to fetch podcast genres",
            statusText: response.statusText,
            status: response.status
        }
    }

    while(response.ok) {
        const genre: Genre = await response.json()
        genreArray.push(genre)
        idCounter++
        response = await fetch(`https://podcast-api.netlify.app/genre/${idCounter}`)
    }

    return genreArray
}

export async function fetchPodcasts() {
    const response = await fetch("https://podcast-api.netlify.app")
    if (!response.ok) {
        throw {
            message: "Failed to fetch podcast IDs",
            statusText: response.statusText,
            status: response.status
        }
    }
    const previews = await response.json()

    const podcastIdArray = previews.map((podcast: Preview) => podcast.id)

    let podcastArray: Show[] = []
    for (let i = 0; i < podcastIdArray.length; i++) {
        const response = await fetch(`https://podcast-api.netlify.app/id/${podcastIdArray[i]}`)
        if (!response.ok) {
            throw {
                message: "Failed to fetch podcasts",
                statusText: response.statusText,
                status: response.status
            }
        }
        const podcast: Show = await response.json()
        podcastArray.push(podcast)
    }
    return podcastArray
}