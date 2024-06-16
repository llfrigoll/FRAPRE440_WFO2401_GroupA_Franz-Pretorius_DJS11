import {Preview, Show, Season, Episode, Genre} from './interfaces'

export async function getAllPreviews() {
    const response = await fetch("https://podcast-api.netlify.app")
    if (!response.ok) {
        throw {
            message: "Failed to fetch podcast info",
            statusText: response.statusText,
            status: response.status
        }
    }
    const previews: Preview[] = await response.json()
    

    return previews
}

export async function getShow(showId: string) {
    const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`)
        if (!response.ok) {
            throw {
                message: "Failed to fetch podcast",
                statusText: response.statusText,
                status: response.status
            }
        }
        const podcast: Show = await response.json()

        return podcast
}

export async function getSinglePreview(showId: string) {
    const previews: Preview[] = await getAllPreviews()
    const preview = previews.find(preview => {
        preview.id === showId
    })

    return preview
}

export async function getSeason(showId: string, seasonNum: number) {
    const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`)
    if (!response.ok) {
        throw {
            message: "Failed to fetch podcast info",
            statusText: response.statusText,
            status: response.status
        }
    }
    const show: Show = await response.json()
    const season: Season = show.seasons[seasonNum - 1]

    return season
}

export async function getEpisode(season: Season, episodeNum: number) {
    const episode: Episode = season.episodes[episodeNum - 1]

    return episode
}

export async function getGenres() {
    let genreArray: Genre[] = []

    const previews = await getAllPreviews()
    const genreIdSet = new Set()
    previews.forEach(preview => {
        preview.genres.forEach(genreId => {
            genreIdSet.add(genreId)
        })
    })
    const genreIdArray = Array.from(genreIdSet)

    let response = await fetch(`https://podcast-api.netlify.app/genre/${genreIdArray[0]}`)
    if (!response.ok) {
        throw {
            message: "Failed to fetch podcast genres",
            statusText: response.statusText,
            status: response.status
        }
    }
    const genre: Genre = await response.json()
    genreArray.push(genre)

    for(let i = 1; i < genreIdArray.length; i++) {
        let response = await fetch(`https://podcast-api.netlify.app/genre/${genreIdArray[i]}`)
        if (!response.ok) {
            throw {
                message: "Failed to fetch podcast genre",
                statusText: response.statusText,
                status: response.status
            }
        }
        const genre: Genre = await response.json()
        genreArray.push(genre)
    }

    return genreArray
}

// export async function fetchPodcasts() {
//     const response = await fetch("https://podcast-api.netlify.app")
//     if (!response.ok) {
//         throw {
//             message: "Failed to fetch podcast IDs",
//             statusText: response.statusText,
//             status: response.status
//         }
//     }
//     const previews = await response.json()

//     const podcastIdArray = previews.map((podcast: Preview) => podcast.id)

//     let podcastArray: Show[] = []
//     for (let i = 0; i < podcastIdArray.length; i++) {
//         const response = await fetch(`https://podcast-api.netlify.app/id/${podcastIdArray[i]}`)
//         if (!response.ok) {
//             throw {
//                 message: "Failed to fetch podcasts",
//                 statusText: response.statusText,
//                 status: response.status
//             }
//         }
//         const podcast: Show = await response.json()
//         podcastArray.push(podcast)
//     }
//     return podcastArray
// }