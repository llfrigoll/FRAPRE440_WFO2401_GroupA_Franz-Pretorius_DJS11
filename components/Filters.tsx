import React, { useEffect, useState } from "react";
import Select, { StylesConfig, SingleValue } from 'react-select';
import { getAllPreviews, getGenres } from "../utils/Api";
import LoadIcon from "./LoadIcon";
import { Genre, Preview } from "../utils/interfaces";

interface OptionType {
    value: string;
    label: string;
}

interface FiltersProps {
    setState: (previews: Preview[]) => void;
}

export default function Filters({ setState }: FiltersProps) {
    const [genreNames, setGenreNames] = useState<OptionType[]>([]);
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [previews, setPreviews] = useState<Preview[]>([]);
    const [defaultFilter, setDefaultFilter] = useState<Preview[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<OptionType | null>(null);
    const [sortFunction, setSortFunction] = useState<(a: Preview, b: Preview) => number>(() => (a, b) => 0);

    useEffect(() => {
        async function loadPreviews() {
            setLoading(true);
            const localPreviews = await getAllPreviews();
            setPreviews(localPreviews);
            setDefaultFilter(localPreviews);
            setLoading(false);
        }
        loadPreviews();
    }, []);

    useEffect(() => {
        async function loadGenreFilter() {
            const localGenres = await getGenres();
            setGenres(localGenres);
            const options = localGenres.map(genre => ({
                value: genre.title.toLowerCase(),
                label: genre.title
            }));
            setGenreNames(options);
        }
        loadGenreFilter();
    }, []);

    const customStyles: StylesConfig<OptionType, false> = {
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
    };

    const applyFiltersAndSort = () => {
        let filteredPreviews = [...defaultFilter];

        if (selectedGenre) {
            const genre = genres.find(g => g.title.toLowerCase() === selectedGenre.value);
            if (genre) {
                filteredPreviews = filteredPreviews.filter(preview => genre.shows.includes(preview.id));
            }
        }

        filteredPreviews.sort(sortFunction);
        setState(filteredPreviews);
    };

    const handleGenreChange = (selectedOption: SingleValue<OptionType>) => {
        setSelectedGenre(selectedOption);
        applyFiltersAndSort();
    };

    const handleSort = (sortFunc: (a: Preview, b: Preview) => number) => {
        setSortFunction(() => sortFunc);
        applyFiltersAndSort();
    };

    if (loading) {
        return (
            <div data-ref="dashboard-container" className="pt-20">
                <LoadIcon />
            </div>
        );
    }

    return (
        <div
            data-ref="filters-container"
            className="flex justify-between rounded-sm bg-white w-2/5 ml-auto mr-auto mt-10 px-6 py-2"
        >
            <button
                onClick={() => {
                    setSelectedGenre(null);
                    setSortFunction(() => (a, b) => 0);
                    setState(defaultFilter);
                }}
                className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
            >
                All
            </button>
            <button
                onClick={() => handleSort((a, b) => a.title.localeCompare(b.title))}
                className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
            >
                A-Z
            </button>
            <button
                onClick={() => handleSort((a, b) => -a.title.localeCompare(b.title))}
                className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
            >
                Z-A
            </button>
            <button
                onClick={() => handleSort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())}
                className="hover:text-gray-500 hover:font-normal text-slate-800 font-medium"
            >
                Newest
            </button>
            <button
                onClick={() => handleSort((a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime())}
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
