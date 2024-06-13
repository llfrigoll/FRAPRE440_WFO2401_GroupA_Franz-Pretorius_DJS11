import React from "react"
//import {Preview, Show, Season, Episode, Genre} from '../utils/interfaces'

export default function Header() {

    return (
        <div className="header">
         <input
             type="search"
             name="search-bar"
             id="search-bar"
             className="search-bar"
              //onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search podcast"
         />
        </div>
    )
}