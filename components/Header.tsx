import React from "react"
//import {Preview, Show, Season, Episode, Genre} from '../utils/interfaces'

export default function Header() {

    return (
        <div data-ref="header"className="flex w-screen bg-slate-800 h-20">
            <img src="./images/Podd_Logo.png" className="h-3/4 mt-auto mb-auto ml-5"/>
            <h1 className="text-slate-400 font-semibold text-3xl mt-auto mb-auto ml-2">Podd</h1>
            <div className="relative h-1/2 ml-auto mr-5 mt-auto mb-auto">
                <input type="text" data-ref="search-bar" placeholder="Search" className="p-2 pr-10 bg-slate-600 placeholder-slate-300 rounded-2xl text-slate-300 focus:outline focus:outline-2 focus:outline-slate-300"/>
                <img src="./images/magnifying_glass.png" className="h-6 w-6 absolute top-1/2 right-2 -translate-y-1/2 hover:cursor-pointer"/>
            </div>  
        </div>
    )
}