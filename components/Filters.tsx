import React, { useEffect, useState } from "react"
import Select from 'react-select'
import { getGenres } from "../utils/Api"
import LoadIcon from "./LoadIcon"



export default function Filters() {
    const [genreNames, setGenreNames] = useState<Object[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function loadGenreFilter() {
            setLoading(true)
            const genres = await getGenres()
            const options = genres.map(genre => {
                const option = {
                    value: genre.title.toLowerCase(),
                    label: genre.title
                }
                return option
            })
            setGenreNames(options)
            setLoading(false)
        }
        loadGenreFilter()
    }, [])
    
    if (loading) {
        return (
            <div data-ref="dashboard-container" className="pt-20">
                <LoadIcon />
            </div>
        )
    }

    return (
        <div data-ref="filters-container" className="flex justify-between bg-white w-2/5 ml-auto mr-auto mt-10 px-6 py-2">
            <button className="mr-2">Default</button>
            <button className="">A-Z</button>
            <button className="">Z-A</button>
            <button className="">Newest</button>
            <button className="">Oldest</button>
            <Select options={genreNames} isClearable={true} placeholder="Select Genre" />
        </div>
    )
}