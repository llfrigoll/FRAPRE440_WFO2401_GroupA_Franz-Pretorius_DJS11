import { useEffect, useState } from 'react'
import Select, { StylesConfig, SingleValue } from 'react-select'
import { getGenres } from '../utils/Api'
import { Preview } from '../utils/interfaces'
import LoadIcon from './LoadIcon'

interface OptionType {
    value: string
    label: string
}

interface FiltersProps {
    onGenreChange: (genre: string | null) => void
    onSortChange: (sortFunc: (a: Preview, b: Preview) => number) => void
}

export default function Filters({ onGenreChange, onSortChange }: FiltersProps) {
    const [genreNames, setGenreNames] = useState<OptionType[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedSort, setSelectedSort] = useState<string | null>(null)

    useEffect(() => {
        async function loadGenres() {
            setLoading(true)
            handleSortChange('A-Z', (a, b) => a.title.localeCompare(b.title))
            const localGenres = await getGenres()
            const options = localGenres.map(genre => ({
                value: genre.title.toLowerCase(),
                label: genre.title,
            }))
            setGenreNames(options)
            setLoading(false)
        }
        loadGenres()
    }, [])

    const customStyles: StylesConfig<OptionType, false> = {
        control: provided => ({
            ...provided,
            border: 'none',
            boxShadow: 'none',
            width: 200,
            '&:hover': {
                border: 'none',
                color: 'rgb(107, 114, 128)',
                cursor: 'pointer',
            },
        }),
        placeholder: provided => ({
            ...provided,
            color: 'rgb(30,41,59)',
            fontWeight: 500,
        }),
    }

    const handleGenreChange = (selectedOption: SingleValue<OptionType>) => {
        onGenreChange(selectedOption ? selectedOption.value : null)
    }

    const handleSortChange = (
        sortLabel: string,
        sortFunc: (a: Preview, b: Preview) => number
    ) => {
        setSelectedSort(sortLabel)
        onSortChange(sortFunc)
    }

    const propsColor = 'border-slate-800'
    if (loading) {
        return (
            <div data-ref="filters-container" className="pt-140 ml-auto mr-20">
                <LoadIcon iconColor={propsColor} />
            </div>
        )
    }

    return (
        <div
            data-ref="filters-container"
            className="flex gap-14 rounded-sm w-fit ml-auto mr-10 mt-10 px-6 py-2 z-20">
            <button
                onClick={() =>
                    handleSortChange('A-Z', (a, b) =>
                        a.title.localeCompare(b.title)
                    )
                }
                className={`hover:text-gray-500 hover:font-normal text-slate-800 font-medium ${
                    selectedSort === 'A-Z' ? 'underline' : ''
                }`}>
                A-Z
            </button>
            <button
                onClick={() =>
                    handleSortChange(
                        'Z-A',
                        (a, b) => -a.title.localeCompare(b.title)
                    )
                }
                className={`hover:text-gray-500 hover:font-normal text-slate-800 font-medium ${
                    selectedSort === 'Z-A' ? 'underline' : ''
                }`}>
                Z-A
            </button>
            <button
                onClick={() =>
                    handleSortChange(
                        'Newest',
                        (a, b) =>
                            new Date(b.updated).getTime() -
                            new Date(a.updated).getTime()
                    )
                }
                className={`hover:text-gray-500 hover:font-normal text-slate-800 font-medium ${
                    selectedSort === 'Newest' ? 'underline' : ''
                }`}>
                Newest
            </button>
            <button
                onClick={() =>
                    handleSortChange(
                        'Oldest',
                        (a, b) =>
                            new Date(a.updated).getTime() -
                            new Date(b.updated).getTime()
                    )
                }
                className={`hover:text-gray-500 hover:font-normal text-slate-800 font-medium ${
                    selectedSort === 'Oldest' ? 'underline' : ''
                }`}>
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
    )
}
