import { useEffect, useState } from 'react'
import { Carousel } from 'react-bootstrap'
import { getAllPreviews, getGenres } from '../utils/Api'
import { Genre, Preview } from '../utils/interfaces'
import LoadIcon from './LoadIcon'

interface Info {
    title: string
    seasons: string
    genres: string
    updated: string
    image: string
    description: string
}

export default function CustomCarousel() {
    const [info, setInfo] = useState<Info[]>([])
    const [loading, setLoading] = useState(false)

    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    //Generates 5 random numbers for given total
    function randomNums(totalItems: number) {
        const nums = []
        for (let i = 0; i < 5; i++)
            nums.push(Math.round(Math.random() * (totalItems - 1)))
        return nums
    }

    //Fetches previews for 5 random shows
    useEffect(() => {
        async function getInfo() {
            setLoading(true)
            const previews: Preview[] = await getAllPreviews()
            const allGenres: Genre[] = await getGenres()

            const randomNumbers = randomNums(previews.length)

            const localInfo: Info[] = []
            randomNumbers.map(randomNumber => {
                const title = previews[randomNumber].title
                const image = previews[randomNumber].image
                const seasons = previews[randomNumber].seasons.toString()
                const date = new Date(previews[randomNumber].updated)
                const updated = `${date.getDate()} ${
                    months[date.getMonth()]
                } ${date.getFullYear()}`
                const genres: string[] = previews[randomNumber].genres.map(
                    num => allGenres[num - 1].title
                )
                const description = previews[randomNumber].description

                const singleInfo: Info = {
                    title: title,
                    image: image,
                    seasons: seasons,
                    updated: updated,
                    genres: genres.join(','),
                    description: description,
                }
                localInfo.push(singleInfo)
            })
            setInfo(localInfo)
            setLoading(false)
        }
        getInfo()
    }, [])

    //Loading state
    const propsColor = 'border-slate-800'
    if (loading) {
        return (
            <div className="pb-10">
                <LoadIcon iconColor={propsColor} />
            </div>
        )
    }

    return (
        <div className="flex">
            <Carousel className="w-4/5 h-96 mx-auto mt-10 mb-3">
                {info.map((item, index) => (
                    <Carousel.Item key={index}>
                        <div className="flex h-full">
                            <img
                                src={item.image}
                                alt={`Slide ${index + 1}`}
                                className="rounded-l-xl ml-36 w-1/4 h-1/4"
                            />
                            <div className="flex flex-col pl-4 pt-2 mr-36 cursor-default bg-white rounded-r-xl">
                                <h2 className="text-2xl font-semibold mb-2">
                                    {item.title}
                                </h2>
                                <p>Seasons: {item.seasons}</p>
                                <p>Genres {item.genres}</p>
                                <p className="mb-2">
                                    Last updated: {item.updated}
                                </p>
                                <p className="text-xs pr-36 h-40 overflow-y-hidden">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    )
}
