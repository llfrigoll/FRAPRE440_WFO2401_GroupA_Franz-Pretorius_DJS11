import React, { useEffect, useState } from "react"
import Select, { StylesConfig, createFilter } from 'react-select'
import { getAllPreviews, getGenres } from "../utils/Api"
import LoadIcon from "./LoadIcon"
import { Genre, Preview } from "../utils/interfaces"



export default function Filters({setState}: any) {
    const [genreNames, setGenreNames] = useState<Object[]>([])
    const [loading, setLoading] = useState(false)
    let previews: Preview[] = []
    let defaultFilter: Preview[] = []
    let genres: Genre[] = []

    async function loadPreviews() {
        previews = await getAllPreviews()
        defaultFilter = [...previews]
    }
    loadPreviews()
    

    useEffect(() => {
        async function loadGenreFilter() {
            setLoading(true)
            genres = await getGenres()
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

    const handleGenreChange = (selectedOption: any) => {
        if(!selectedOption) {
            setState(previews)
        } else {
            
        }
    }

    const bleh = (selectedOption: any) => {
        if (!selectedOption) {
            setState(defaultFilter)
        } else {
            const selectedGenre = genres.find(genre => genre.title.toLowerCase() === selectedOption.value)
            if (selectedGenre) {
                const filteredPreviews = previews.filter(preview => selectedGenre.previews.includes(preview.id))
                setState(filteredPreviews)
            }
        }
    }

    return (
      <div
        data-ref="filters-container"
        className="flex justify-between rounded-sm bg-white w-2/5 ml-auto mr-auto mt-10 px-6 py-2"
      >
        <button
          onClick={() => {
            previews = []
            previews = [...defaultFilter]
            setState(previews)}
          }
          className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
        >
          Default
        </button>
        <button
          onClick={() => {
            const sortedPreviews = [...previews.sort((a: Preview, b: Preview) =>
                a.title.localeCompare(b.title)
              )]
            previews = [...sortedPreviews]
            setState(previews)}
          }
          className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
        >
          A-Z
        </button>
        <button
          onClick={() => {
            const sortedPreviews = [...previews.sort((a: Preview, b: Preview) =>
                -a.title.localeCompare(b.title)
              )]
            previews = [...sortedPreviews]
            setState(previews)}
          }
          className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
        >
          Z-A
        </button>
        <button
          onClick={() => {
            const sortedPreviews = [...previews.sort((a: Preview, b: Preview) => {
                return -(new Date(a.updated).getTime() - new Date(b.updated).getTime());
              })]
              previews = [...sortedPreviews]
            setState(previews)}
          }
          className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
        >
          Newest
        </button>
        <button
          onClick={() => {
            const sortedPreviews = [...previews.sort((a: Preview, b: Preview) => {
                return new Date(a.updated).getTime() - new Date(b.updated).getTime();
              })]
              previews = [...sortedPreviews]
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