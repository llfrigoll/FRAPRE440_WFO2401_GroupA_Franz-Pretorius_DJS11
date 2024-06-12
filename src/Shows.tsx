import { useState, useEffect } from "react"
import { fetchPodcasts } from "../utils/Api"
import {Preview, Show, Season, Episode, Genre} from '../utils/interfaces'

export default function Shows() {
    const [podcasts, setPodcasts] = useState<Show[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        async function loadPodcasts() {
            setLoading(true)
            try {
                const data = await fetchPodcasts()
                setPodcasts(data)
            } catch (err: any) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        loadPodcasts()
    }, [])

    if (loading) {
        return <h1>Loading...</h1>
    }
    
    if (error) {
        return <h1>There was an error: {error.message}</h1>
    }

    return (
        <div>SUCCESSFUL</div>
    )
}