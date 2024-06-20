import React, { useEffect, useState } from 'react';
import { Carousel } from "react-bootstrap";
import poddLogo from '../images/Podd_Logo.png';
import { getAllPreviews } from '../utils/Api';

interface Info {
    title: string,
    seasons: string,
    genres: string,
    updated: string,
    image: string
}

export default function CustomCarousel() {
const [info, setInfo] = useState<Info[]>([])
const [loading, setLoading] = useState(false)


function randomNums(totalItems: number) {
    const nums = []
    for(let i = 0; i < 5; i++)
        nums.push(Math.round((Math.random() * (totalItems - 1))))
    return nums
}

useEffect(() => {
    async function getInfo() {
        setLoading(true)
        const previews = await getAllPreviews()
        const randomNumbers = randomNums(previews.length)

        const localInfo: Info[] = [] 
        randomNumbers.map(randomNumber => {
            const title = previews[randomNumber].title
            const image = previews[randomNumber].image
            const seasons = previews[randomNumber].seasons.toString()
            const updated = previews[randomNumber].updated.toString()
            const genres = previews[randomNumber].genres[0].toString()

            const singleInfo: Info = {
                title: title,
                image: image,
                seasons: seasons,
                updated: updated,
                genres: genres
            }
            localInfo.push(singleInfo)

        })
        setInfo(localInfo)
        setLoading(false)
    }
    getInfo()
    
},[])

if(loading){
    return <div></div>
}else {
    return (
        <div className='flex'>
            <Carousel className='w-3/4 h-96 ml-auto mr-auto mt-10'>
                {info.map((item, index) => (
                    <Carousel.Item key={index} interval={5000}>
                        <img src={item.image} alt={`Slide ${index + 1}`} className='rounded-lg w-1/3 flex flex-row' />
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    )
}
}
