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


function randomNums(totalItems: number) {
    const nums = []
    for(let i = 0; i < 5; i++)
        nums.push(Math.round((Math.random() * (totalItems - 1))))
    return nums
}

useEffect(() => {
    async function getInfo() {
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
        setInfo([...localInfo])
        console.log(localInfo)
    }
    getInfo()
},[])


  return (
    <div className='flex'>
      <Carousel className='w-3/4 h-96 ml-auto mr-auto mt-10'>
            <Carousel.Item interval={5000}>
            <img src={} alt="First slide" className='rounded-lg w-1/3 flex flex-row'/>
            </Carousel.Item>
            <Carousel.Item interval={5000} >
            <img src={} alt="Second slide" className='rounded-lg w-1/3 flex flex-row'/>
            </Carousel.Item>
            <Carousel.Item interval={5000} >
            <img src={} alt="Third slide" className='rounded-lg w-1/3 flex flex-row'/>
            </Carousel.Item>
            <Carousel.Item interval={5000} >
            <img src={} alt="Fourth slide" className='rounded-lg w-1/3 flex flex-row'/>
            </Carousel.Item>
            <Carousel.Item interval={5000} >
            <img src={} alt="Fifth slide" className='rounded-lg w-1/3 flex flex-row'/>
            </Carousel.Item>
        </Carousel>
        </div>
  )
}
