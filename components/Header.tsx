import React from "react"
//import {Preview, Show, Season, Episode, Genre} from '../utils/interfaces'

export default function Header() {

    return (
        <div data-ref="header"className="flex w-screen bg-slate-800 h-20">
            <div className="relative h-1/2 ml-auto mr-5 mt-auto mb-auto">
                <input type="text" data-ref="search-bar" placeholder="Search podcast" className="p-2 pr-6 bg-slate-600 placeholder-slate-400 outline outline-2 outline-slate-400 rounded-2xl text-slate-300 focus:placeholder-slate-300 focus:outline-slate-300"/>
                <img src="./images/magnifying_glass.png" className="h-6 w-6 absolute top-1/2 right-1 -translate-y-1/2 "/>
            </div>  
        </div>
    )
}