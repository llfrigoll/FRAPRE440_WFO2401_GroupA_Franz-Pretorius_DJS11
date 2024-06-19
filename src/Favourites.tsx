import React, { useCallback, useState } from "react"
import { Preview } from "../utils/interfaces";
import Filters from "../components/Filters";

interface FavouriteProps {
    handleNav: (value: boolean) => void
}



export default function Favourites({handleNav}: FavouriteProps) {
    const [sortFunction, setSortFunction] = useState<(a: Preview, b: Preview) => number>(() => () => 0);

    

    const handleSortChange = (sortFunc: (a: Preview, b: Preview) => number) => {
        setSortFunction(() => sortFunc);
    };

    const applyFiltersAndSort = useCallback(() => {
        let updatedPreviews = [...previews];

        updatedPreviews.sort(sortFunction);
        setFilteredPreviews(updatedPreviews);
    }, [previews, searchText, selectedGenre, sortFunction, genres]);

    return (
        <div data-ref="favourites-container" className="pt-20 bg-slate-300 min-h-screen border border-purple-500 border-solid">
            <div className="flex flex-row">
                <h1 className="text-slate-600 font-semibold text-3xl ml-20 pt-10 mt-auto mb-auto">Favourites</h1> 
                <Filters onGenreChange={() => null} onSortChange={handleSortChange} />
            </div>
        </div>


    )
}