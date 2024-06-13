import React from "react"
//import {Preview, Show, Season, Episode, Genre} from '../utils/interfaces'

export default function Header() {

    return (
        <div data-ref="header" className="">
         <input
             type="search"
             id="search-bar"
             placeholder="Search podcast"
         />
        </div>
    )
}