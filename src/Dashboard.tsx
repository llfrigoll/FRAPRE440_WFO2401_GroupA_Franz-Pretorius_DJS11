import { useState, useEffect } from "react"
import {Preview, Show, Season, Episode, Genre} from '../utils/interfaces'
import { getGenres, getPreviews } from "../utils/Api"
import LoadIcon from '../components/LoadIcon'

export default function Dashboard() {
    const [previews, setPreviews] = useState<Preview[]>([])
    const [genres, setGenres] = useState<Genre[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        async function loadPreviews() {
            setLoading(true)
            try {
                // const previewData = await getPreviews()
                // setPreviews(previewData)
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
            <LoadIcon />
        )
    }
    
    if (error) {
        return <h1>There was an error: {error.message}</h1>
    }

    return (
        <></>
    )
}