import React, { useState, useEffect } from 'react'

interface SearchBarProps {
    onSearchTextChange: (text: string) => void
    hidepopup: () => void
    handleNav: (value: boolean) => void
}

export default function SearchBar({
    onSearchTextChange,
    hidepopup,
    handleNav,
}: SearchBarProps) {
    const [text, setText] = useState('')

    //Sets searched text to text entered as its entered
    useEffect(() => {
        onSearchTextChange(text)
    }, [text, onSearchTextChange])

    //Handles change
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
    }

    //When searchbar is active the modal, navbar and popup closes
    const focusHandler = () => {
        hidepopup()
        handleNav(false)
    }

    //Clears searchtext
    const clearHandler = () => {
        setText('')
    }

    return (
        <div data-ref="search-bar" className="fixed right-16 top-4 z-50">
            <input
                onFocus={focusHandler}
                onChange={handleTextChange}
                value={text}
                type="text"
                data-ref="search-input"
                placeholder="Search"
                className="absolute p-2 pr-10 right-0 bg-slate-600 placeholder-slate-300 rounded-2xl text-slate-300 focus:outline focus:outline-2 focus:outline-slate-300"
            />
            <button
                onClick={clearHandler}
                className="font-medium relative mt-2 mr-4 text-slate-300">
                x
            </button>
        </div>
    )
}
