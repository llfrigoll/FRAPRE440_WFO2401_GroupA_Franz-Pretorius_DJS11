import React from "react"

interface FavouriteProps {
    handleNav: (value: boolean) => void
}

export default function Favourites({handleNav}: FavouriteProps) {
    return (
        <div data-ref="favourites-container" className="pt-20 bg-slate-300 min-h-screen border border-purple-500 border-solid">
            <h1>Favourites</h1>
        </div>
    )
}