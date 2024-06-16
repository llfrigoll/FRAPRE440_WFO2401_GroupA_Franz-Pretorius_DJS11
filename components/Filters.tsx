import React, { useEffect, useState, useCallback } from "react";
import Select, { StylesConfig, SingleValue } from 'react-select';
import { getAllPreviews, getGenres } from "../utils/Api";
import { Genre, Preview } from "../utils/interfaces";
import LoadIcon from "./LoadIcon";

interface OptionType {
    value: string;
    label: string;
}

interface FiltersProps {
    onGenreChange: (genre: string | null) => void;
    onSortChange: (sortFunc: (a: Preview, b: Preview) => number) => void;
}

export default function Filters({ onGenreChange, onSortChange }: FiltersProps) {
    const [genreNames, setGenreNames] = useState<OptionType[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState<OptionType | null>(null);
    const [selectedSort, setSelectedSort] = useState<string | null>(null);

    useEffect(() => {
        async function loadGenres() {
            setLoading(true);
            handleSortChange("A-Z", (a, b) => a.title.localeCompare(b.title))
            const localGenres = await getGenres();
            const options = localGenres.map(genre => ({
                value: genre.title.toLowerCase(),
                label: genre.title
            }));
            setGenreNames(options);
            setLoading(false);
        }
        loadGenres();
    }, []);

    const customStyles: StylesConfig<OptionType, false> = {
        control: (provided) => ({
            ...provided,
            border: 'none',
            boxShadow: 'none',
            width: 200,
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

    const handleGenreChange = (selectedOption: SingleValue<OptionType>) => {
        setSelectedGenre(selectedOption);
        onGenreChange(selectedOption ? selectedOption.value : null);
    };

    const handleSortChange = (sortLabel: string, sortFunc: (a: Preview, b: Preview) => number) => {
        setSelectedSort(sortLabel);
        onSortChange(sortFunc);
    };

    if (loading) {
        return (
            <div data-ref="filters-container" className="pt-20">
                <LoadIcon />
            </div>
        );
    }

    return (
        <div
            data-ref="filters-container"
            className="flex justify-between rounded-sm w-2/5 ml-auto mr-10 mt-10 px-6 py-2 z-20"
        >
            <button
                onClick={() => handleSortChange("A-Z", (a, b) => a.title.localeCompare(b.title))}
                className={`hover:text-gray-500 hover:font-normal text-slate-800 font-medium ${selectedSort === "A-Z" ? "underline" : ""}`}
            >
                A-Z
            </button>
            <button
                onClick={() => handleSortChange("Z-A", (a, b) => -a.title.localeCompare(b.title))}
                className={`hover:text-gray-500 hover:font-normal text-slate-800 font-medium ${selectedSort === "Z-A" ? "underline" : ""}`}
            >
                Z-A
            </button>
            <button
                onClick={() => handleSortChange("Newest", (a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())}
                className={`hover:text-gray-500 hover:font-normal text-slate-800 font-medium ${selectedSort === "Newest" ? "underline" : ""}`}
            >
                Newest
            </button>
            <button
                onClick={() => handleSortChange("Oldest", (a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime())}
                className={`hover:text-gray-500 hover:font-normal text-slate-800 font-medium ${selectedSort === "Oldest" ? "underline" : ""}`}
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
