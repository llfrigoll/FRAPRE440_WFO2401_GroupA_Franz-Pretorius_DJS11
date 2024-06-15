import React, { useEffect, useState } from "react";
import Select, { StylesConfig } from 'react-select';
import { getAllPreviews, getGenres } from "../utils/Api";
import LoadIcon from "./LoadIcon";
import { Genre, Preview } from "../utils/interfaces";

export default function Filters({ setState }: any) {
    const [genreNames, setGenreNames] = useState<Object[]>([]);
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [previews, setPreviews] = useState<Preview[]>([]);
    const [defaultFilter, setDefaultFilter] = useState<Preview[]>([]);

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

    if (loading) {
        return (
            <div data-ref="dashboard-container" className="pt-20">
                <LoadIcon />
            </div>
        );
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
    };

    const handleGenreChange = (selectedOption: any) => {
        if (!selectedOption) {
            setState(previews);
        } else {
            const selectedGenre = genres.find(genre => genre.title.toLowerCase() === selectedOption.value);
            if (selectedGenre) {
                const showIds = selectedGenre.shows;
                const genreFilter = previews.filter(preview => showIds.includes(preview.id));
                setState(genreFilter);
            }
        }
    };

    const handleSort = (sortFunction: (a: Preview, b: Preview) => number) => {
        const sortedPreviews = [...previews].sort(sortFunction);
        setState(sortedPreviews);
    };

    return (
        <div
            data-ref="filters-container"
            className="flex justify-between rounded-sm bg-white w-2/5 ml-auto mr-auto mt-10 px-6 py-2"
        >
            <button
                onClick={() => setState(defaultFilter)}
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
