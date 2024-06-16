import React, { useEffect, useState } from "react";
import { Preview } from "../utils/interfaces";
import { getAllPreviews } from "../utils/Api";
import LoadIcon from "./LoadIcon";

interface SearchBarProps {
    setState: (previews: Preview[]) => void;
    state: Preview[]
}

export default function SearchBar({ setState, state }: SearchBarProps) {
    const [previews, setPreviews] = useState<Preview[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function loadPreviews() {
            setLoading(true);
            const localPreviews: Preview[] = [...state] 
            setPreviews(localPreviews);
            setLoading(false);
        }
        loadPreviews();
    }, []);

    function handleChange() {
        let textInput = document.querySelector('input[data-ref="search-input"]')?.textContent
        if(textInput) {
            const filterPreviews = state.filter(preview => {
                return preview.title.toLowerCase().includes(textInput.toLowerCase())
            })
            setState(filterPreviews)
        }
    }

    if (loading) {
        return (
            <div data-ref="dashboard-container" className="pt-20">
                <LoadIcon />
            </div>
        );
    }

    return (
        <div data-ref="search-bar" className="relative h-1/2 ml-auto mr-14 pt-5 mb-auto z-10 border-1 border-solid border-red-500">
            <input onChange={handleChange} type="text" data-ref="search-input" placeholder="Search" className="absolute p-2 pr-10 right-0 bg-slate-600 placeholder-slate-300 rounded-2xl text-slate-300 focus:outline focus:outline-2 focus:outline-slate-300"/>
        </div> 
    )  
}
