import React, { useEffect, useState } from "react"
import Select, { StylesConfig } from 'react-select'
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

    const customStyles: StylesConfig = {
        control: (provided) => ({
            ...provided,
            border: 'none',
            boxShadow: 'none',
            '&:hover': {
                border: 'none',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "rgb(30,41,59)",
            fontWeight: 500
        })
    }

    return (
        <div data-ref="filters-container" className="flex justify-between bg-white w-2/5 ml-auto mr-auto mt-10 px-6 py-2">
            <button className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium">Default</button>
            <button className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium">A-Z</button>
            <button className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium">Z-A</button>
            <button className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium">Newest</button>
            <button className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium">Oldest</button>
            <Select styles={customStyles} options={genreNames} isClearable={true} placeholder="Genres" />
        </div>
    )
}