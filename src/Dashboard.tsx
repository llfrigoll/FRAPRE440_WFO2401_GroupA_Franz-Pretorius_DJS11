import { useState, useEffect } from "react"
import {Preview, Show, Season, Episode, Genre} from '../utils/interfaces'
import { getAllPreviews, getGenres, getSinglePreview } from "../utils/Api"
import LoadIcon from '../components/LoadIcon'
import PodcastTile from '../components/PodcastTile'
import Filters from '../components/Filters'
import SearchBar from '../components/SearchBar'

export default function Dashboard() {
    const [previews, setPreviews] = useState<Preview[]>([])
    const [genres, setGenres] = useState<Genre[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)

    function handlePreviews(previews: Preview[]) {
        setPreviews(previews)
    }

    useEffect(() => {
        async function loadPreviews() {
            setLoading(true)
            try {
                const previewData = await getAllPreviews()
                setPreviews(previewData)
                const genresData = await getGenres()
                setGenres(genresData)
            } catch (err: any) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }
        loadPreviews()
    }, [])

    if (loading) {
        return (
            <div data-ref="dashboard-container" className="pt-20">
                <LoadIcon />
            </div>
        )
    }
    
    if (error) {
        return <h1>There was an error: {error.message}</h1>
    }

    
    const previewTiles = previews.map(preview => {
        let props = {
            propsPreview: preview,
            propsGenres: genres
            
        }
            
        return (
            <PodcastTile {...props}/>
        )
        
    })
    
    return (
        <>
            <SearchBar setState = {handlePreviews} state ={previews}/>
            <div data-ref="dashboard-container" className="pt-20 bg-slate-300 transition-all">
                <Filters setState = {handlePreviews}/>
                <div data-ref="tile-container" className="grid grid-cols-5 gap-10  p-10">
                    {previewTiles}
                </div>
            </div>
        </>
    )
}