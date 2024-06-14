import React from "react"
import { Preview, Genre } from '../utils/interfaces'

export default function PodcastTile(props: any) {
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const title = props.propsPreview.title
    const seasons = props.propsPreview.seasons
    const image = props.propsPreview.image
    const genres = props.propsPreview.genres
    const updatedDate = new Date(props.propsPreview.updated)
    const updated = `${updatedDate.getDate()} ${months[updatedDate.getMonth()]} ${updatedDate.getFullYear()}`
    const allGenres = props.propsGenres

    let genreNames: string[] = []
    genreNames = genres.map((id: number) => {
        return [...genreNames, allGenres[id-1].title]
    })
    const genreString = genreNames.join(', ')

    return (
        <div data-ref="preview-tile" className="h-100 w-50 flex flex-col items-start p-12 rounded-3xl bg-white">
            <img src={image} className="h-40 w-40 self-center rounded-3xl"/>
            <h1>{title}</h1>
            <p>Seasons: {seasons}</p>
            <p>Genres: {genreString}</p>
            <p>Last updated: {updated}</p>
        </div>
    )
}