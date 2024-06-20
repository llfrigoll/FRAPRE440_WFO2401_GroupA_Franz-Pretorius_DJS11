import { useState, useEffect, useCallback } from "react";
import { Preview, Genre } from '../utils/interfaces';
import { getAllPreviews, getGenres } from "../utils/Api";
import LoadIcon from '../components/LoadIcon';
import PodcastTile from '../components/PodcastTile';
import Filters from '../components/Filters';
import SearchBar from '../components/SearchBar';
import CustomCarousel from '../components/CustomCarousel'


interface DashboardProps {
    onTileClick: (show: Preview) => void;
    hidepopup: () => void;
    handleNav: (value: boolean) => void
}

export default function Dashboard({ onTileClick, hidepopup, handleNav }: DashboardProps) {
    const [previews, setPreviews] = useState<Preview[]>([]);
    const [filteredPreviews, setFilteredPreviews] = useState<Preview[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [sortFunction, setSortFunction] = useState<(a: Preview, b: Preview) => number>(() => () => 0);

    useEffect(() => {
        async function loadPreviews() {
            setLoading(true);
            try {
                const previewData = await getAllPreviews();
                setPreviews(previewData);
                setFilteredPreviews(previewData);
                const genresData = await getGenres();
                setGenres(genresData);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        loadPreviews();
    }, []);

    const applyFiltersAndSort = useCallback(() => {
        let updatedPreviews = [...previews];

        if (selectedGenre) {
            const genre = genres.find(g => g.title.toLowerCase() === selectedGenre);
            if (genre) {
                updatedPreviews = updatedPreviews.filter(preview => genre.shows.includes(preview.id));
            }
        }

        if (searchText) {
            updatedPreviews = updatedPreviews.filter(preview =>
                preview.title.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        updatedPreviews.sort(sortFunction);
        setFilteredPreviews(updatedPreviews);
    }, [previews, searchText, selectedGenre, sortFunction, genres]);

    useEffect(() => {
        applyFiltersAndSort()
    }, [applyFiltersAndSort]);

    const handleSearchTextChange = (text: string) => {
        setSearchText(text);
    };

    const handleGenreChange = (genre: string | null) => {
        setSelectedGenre(genre);
    };

    const handleSortChange = (sortFunc: (a: Preview, b: Preview) => number) => {
        setSortFunction(() => sortFunc);
    };

    const propsColor = 'border-slate-800'
    if (loading) {
        return (
            <div data-ref="dashboard-container" className="pt-20">
                <LoadIcon iconColor ={propsColor}/>
            </div>
        );
    }

    if (error) {
        return <h1>There was an error: {error.message}</h1>;
    }

    const previewTiles = filteredPreviews.map(preview => (
        <PodcastTile key={preview.id} propsPreview={preview} propsGenres={genres} onTileClick={onTileClick}/>
    ));

    return (
      <>
        <SearchBar
          onSearchTextChange={handleSearchTextChange}
          hidepopup={hidepopup}
          handleNav={handleNav}
        />
        <div
          data-ref="dashboard-container"
          className="pt-20 bg-slate-300 transition-all min-h-screen"
        >
          <div className="flex flex-row">
            <h1 className="text-slate-600 font-semibold text-4xl ml-20 pt-10 mt-auto mb-auto">
              Podcasts
            </h1>
            <Filters
              onGenreChange={handleGenreChange}
              onSortChange={handleSortChange}
            />
          </div>
          <hr className="mx-10 mt-4 border-black"/>
          <CustomCarousel/>
          <hr className="mx-10 mb-4 border-black"/>
          <div
            data-ref="tile-container"
            className="grid grid-cols-5 gap-12 p-10"
          >
            {previewTiles.length === 0 ? (
              <div className="col-span-5 mx-auto font-medium">
                No results found.
              </div>
            ) : (
              previewTiles
            )}
          </div>
        </div>
      </>
    );
}
