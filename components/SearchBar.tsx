import React, { useState, useEffect } from "react";

interface SearchBarProps {
    onSearchTextChange: (text: string) => void;
}

export default function SearchBar({ onSearchTextChange }: SearchBarProps) {
    const [text, setText] = useState('');

    useEffect(() => {
        onSearchTextChange(text);
    }, [text, onSearchTextChange]);

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    return (
        <div data-ref="search-bar" className="fixed right-16 pt-5 mb-auto z-50 border-1 border-solid border-red-500">
            <input
                onChange={handleTextChange}
                value={text}
                type="text"
                data-ref="search-input"
                placeholder="Search"
                className="absolute p-2 pr-10 right-0 bg-slate-600 placeholder-slate-300 rounded-2xl text-slate-300 focus:outline focus:outline-2 focus:outline-slate-300"
            />
        </div>
    );
}
