import React, { useEffect, useState } from "react"
import Select, { StylesConfig, createFilter } from 'react-select'
import { getAllPreviews, getGenres } from "../utils/Api"
import LoadIcon from "./LoadIcon"
import { Genre, Preview } from "../utils/interfaces"



export default function Filters({setState}: any) {
    const [genreNames, setGenreNames] = useState<Object[]>([])
    const [loading, setLoading] = useState(false)
    const [genres, setGenres] = useState<Genre[]>([])
    const [isGenreSelected, setIsGenreSelected] = useState(false)
    const [selectedGenre, setSelectedGenre] = useState<any>(null)
    const [previews, setPreviews] = useState<Preview[]>([])
    const [defaultFilter, setDefaultFilter] = useState<Preview[]>([])

    useEffect(() => {
        async function loadPreviews() {
            const localPreviews = await getAllPreviews()
            setPreviews(localPreviews)
            const localDefaultFilter = [...previews]
            setDefaultFilter(localDefaultFilter)
        }
        loadPreviews()
    },[])
        
    useEffect(() => {
        async function loadGenreFilter() {
            setLoading(true)
            const localGenres = await getGenres()
            setGenres(localGenres)
            const options = localGenres.map(genre => {
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

    const handleGenreChange = (selectedOption: any) => {
        if(!selectedOption) {
            setSelectedGenre(null)
            setState(previews)
        } else {
            setSelectedGenre(selectedOption)
            const selectedGenre = genres.find(genre => genre.title.toLowerCase() === selectedOption.value)
            if(selectedGenre) {
                let showIds = []
                showIds = [...selectedGenre.shows]
                const genreFilter = previews.filter(preview => showIds.includes(preview.id))
                setState(genreFilter)
            }
        }
    }

    if(selectedGenre) {
        setIsGenreSelected(true)
    }else{
        setIsGenreSelected(false)
    }

    return (
      <div
        data-ref="filters-container"
        className="flex justify-between rounded-sm bg-white w-2/5 ml-auto mr-auto mt-10 px-6 py-2"
      >
        <button
          onClick={() => {
            setPreviews([])
            setPreviews([...defaultFilter])
            if(isGenreSelected) {
                handleGenreChange(selectedGenre)
            }
            setState(previews)}
          }
          className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
        >
          All
        </button>
        <button
          onClick={() => {
            // previews = []
            // previews = [...defaultFilter]
            const sortedPreviews = [...previews.sort((a: Preview, b: Preview) =>
                a.title.localeCompare(b.title)
              )]
            setPreviews([...sortedPreviews])
            if(isGenreSelected) {
                handleGenreChange(selectedGenre)
            }
            setState(previews)}
          }
          className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
        >
          A-Z
        </button>
        <button
          onClick={() => {
            // previews = []
            // previews = [...defaultFilter]
            const sortedPreviews = [...previews.sort((a: Preview, b: Preview) =>
                -a.title.localeCompare(b.title)
              )]
              setPreviews([...sortedPreviews])
            if(isGenreSelected) {
                handleGenreChange(selectedGenre)
            }
            setState(previews)}
          }
          className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
        >
          Z-A
        </button>
        <button
          onClick={() => {
            // previews = []
            // previews = [...defaultFilter]
            const sortedPreviews = [...previews.sort((a: Preview, b: Preview) => {
                return -(new Date(a.updated).getTime() - new Date(b.updated).getTime());
              })]
              setPreviews([...sortedPreviews])
              if(isGenreSelected) {
                handleGenreChange(selectedGenre)
            }
            setState(previews)}
          }
          className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
        >
          Newest
        </button>
        <button
          onClick={() => {
            // previews = []
            // previews = [...defaultFilter]
            const sortedPreviews = [...previews.sort((a: Preview, b: Preview) => {
                return new Date(a.updated).getTime() - new Date(b.updated).getTime();
              })]
              setPreviews([...sortedPreviews])
              if(isGenreSelected) {
                handleGenreChange(selectedGenre)
            }
            setState(previews)}
          }
          className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
        >
          Oldest
        </button>
        <Select
          styles={customStyles}
          options={genreNames}
          isClearable={true}
          placeholder="Genres"
          onChange={handleGenreChange}
        />
      </div>
    );
}