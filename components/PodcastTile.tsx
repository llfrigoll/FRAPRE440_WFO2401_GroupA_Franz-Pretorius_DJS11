import React from "react"
import { Preview, Genre } from '../utils/interfaces'
import { Link } from 'react-router-dom'

export default function PodcastTile(props: any) {
    const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const id = props.propsPreview.id
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
        <div data-ref="preview-tile" className="h-100 w-50 pt-6 pb-6 flex flex-col items-start rounded-xl bg-white">
            <img src={image} className="h-44 w-44 mb-5 self-center rounded-lg"/>
            <div data-ref="preview-content" className="flex flex-col px-6 max-w-full">
                <h1 className="text-slate-800 font-bold mb-2 text-nowrap truncate">{title}</h1>
                <hr className="mb-2"/>
                <p className="text-slate-800 text-sm">Seasons: {seasons}</p>
                <p className="text-slate-800 text-sm">Genres: {genreString}</p>
                <p className="text-slate-800 text-sm">Last updated: {updated}</p>
            </div>
        </div>
    )
}