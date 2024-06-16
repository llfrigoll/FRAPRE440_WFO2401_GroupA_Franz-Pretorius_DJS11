import React, { useCallback, useEffect, useState } from "react";
import { Preview } from "../utils/interfaces";
import LoadIcon from "./LoadIcon";
import { getAllPreviews } from "../utils/Api";

interface SearchBarProps {
    setState: (previews: Preview[]) => void;
}

export default function SearchBar({ setState}: SearchBarProps) {
    const [previews, setPreviews] = useState<Preview[]>([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('');

    useEffect(() => {
        async function loadPreviews() {
            setLoading(true);
            console.log("Loading previews...");
            const localPreviews: Preview[] = await getAllPreviews();
            setPreviews(localPreviews);
            console.log("Previews loaded:", localPreviews);
            setLoading(false);
        }
        loadPreviews();
    }, []);

    const applyFiltersAndSort = useCallback(() => {
        console.log("Applying filters and sort with text:", text);
        if (text) {
            const filteredPreviews = previews.filter(preview =>
                preview.title.toLowerCase().includes(text.toLowerCase())
            );
            console.log("Filtered previews:", filteredPreviews);
            setState(filteredPreviews);
        } else {
            console.log("Setting all previews as no search text is provided");
            setState(previews);
        }
    }, [text]);

    useEffect(() => {
        applyFiltersAndSort();
    }, [applyFiltersAndSort]);

    const handleText = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Text changed:", event.target.value);
        setText(event.target.value);
    };

    if (loading) {
        return (
            <div data-ref="dashboard-container" className="pt-20">
                <LoadIcon />
            </div>
        );
    }

    return (
        <div data-ref="search-bar" className="relative h-1/2 ml-auto mr-14 pt-5 mb-auto z-10 border-1 border-solid border-red-500">
            <input
                onChange={handleText}
                value={text}
                type="text"
                data-ref="search-input"
                placeholder="Search"
                className="absolute p-2 pr-10 right-0 bg-slate-600 placeholder-slate-300 rounded-2xl text-slate-300 focus:outline focus:outline-2 focus:outline-slate-300"
            />
        </div>
    );
}
