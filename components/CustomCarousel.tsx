import React, { useEffect, useState } from 'react';
import { Carousel } from "react-bootstrap";
import poddLogo from '../images/Podd_Logo.png';
import { getAllPreviews } from '../utils/Api';

export default function CustomCarousel() {
const [images, setImages] = useState<string[]>([])

function randomNums(totalItems: number) {
    const nums = []
    for(let i = 0; i < 5; i++)
        nums.push(Math.round((Math.random() * (totalItems - 1))))
    return nums
}

useEffect(() => {
    async function getImages() {
        const previews = await getAllPreviews()
        const randomNumbers = randomNums(previews.length)
        const imageStrings = randomNumbers.map(randomNumber => previews[randomNumber].image)
        setImages(imageStrings)
    }
    getImages()
},[])


  return (
    <div className='flex'>
      <Carousel className='w-1/4 h-1/4 overflow-hidden ml-auto mr-auto mt-10'>
            <Carousel.Item interval={5000} >
            <img src={images[0]} alt="First slide" className='rounded-lg'/>
            </Carousel.Item>
            <Carousel.Item interval={5000} >
            <img src={images[1]} alt="Second slide" className='rounded-lg'/>
            </Carousel.Item>
            <Carousel.Item interval={5000} >
            <img src={images[2]} alt="Third slide" className='rounded-lg'/>
            </Carousel.Item>
            <Carousel.Item interval={5000} >
            <img src={images[3]} alt="Fourth slide" className='rounded-lg'/>
            </Carousel.Item>
            <Carousel.Item interval={5000} >
            <img src={images[4]} alt="Fifth slide" className='rounded-lg'/>
            </Carousel.Item>
        </Carousel>
        </div>
  )
}
