import {Preview, Show, Season, Episode, Genre} from './interfaces'

export async function fetchPodcasts() {
    let response = await fetch("https://podcast-api.netlify.app")
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
        const podcast = await response.json()
        podcastArray.push(podcast)
    }
    return podcastArray
}