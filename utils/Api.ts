import { Preview, Show, Season, Episode, Genre } from './interfaces'

//Fetches previews from api
export async function getAllPreviews() {
    const response = await fetch('https://podcast-api.netlify.app')
    if (!response.ok) {
        throw {
            message: 'Failed to fetch podcast info',
            statusText: response.statusText,
            status: response.status,
        }
    }
    const previews: Preview[] = await response.json()

    return previews
}

//Fetches individual show from api
export async function getShow(showId: string) {
    const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`)
    if (!response.ok) {
        throw {
            message: 'Failed to fetch podcast',
            statusText: response.statusText,
            status: response.status,
        }
    }
    const podcast: Show = await response.json()

    return podcast
}

//Fetches season according to show
export async function getSeason(showId: string, seasonNum: number) {
    const response = await fetch(`https://podcast-api.netlify.app/id/${showId}`)
    if (!response.ok) {
        throw {
            message: 'Failed to fetch podcast info',
            statusText: response.statusText,
            status: response.status,
        }
    }
    const show: Show = await response.json()
    const season: Season = show.seasons[seasonNum - 1]

    return season
}

//Fetches episode according to season
export async function getEpisode(season: Season, episodeNum: number) {
    const episode: Episode = season.episodes[episodeNum - 1]

    return episode
}

//Gets all individual genre ids from previews and fetches genres from endpoint
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

    let response = await fetch(
        `https://podcast-api.netlify.app/genre/${genreIdArray[0]}`
    )
    if (!response.ok) {
        throw {
            message: 'Failed to fetch podcast genres',
            statusText: response.statusText,
            status: response.status,
        }
    }
    const genre: Genre = await response.json()
    genreArray.push(genre)

    for (let i = 1; i < genreIdArray.length; i++) {
        let response = await fetch(
            `https://podcast-api.netlify.app/genre/${genreIdArray[i]}`
        )
        if (!response.ok) {
            throw {
                message: 'Failed to fetch podcast genre',
                statusText: response.statusText,
                status: response.status,
            }
        }
        const genre: Genre = await response.json()
        genreArray.push(genre)
    }

    return genreArray
}
