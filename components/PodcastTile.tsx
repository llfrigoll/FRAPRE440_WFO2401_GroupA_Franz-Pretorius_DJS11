import React from "react";
import { Preview, Genre } from '../utils/interfaces';

interface PodcastTileProps {
  propsPreview: Preview;
  propsGenres: Genre[];
  onTileClick: (show: Preview) => void;
}

export default function PodcastTile({propsPreview, propsGenres, onTileClick}: PodcastTileProps) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const { id, title, seasons, image, genres, updated: updatedDateStr } = propsPreview;
  const updatedDate = new Date(updatedDateStr);
  const updated = `${updatedDate.getDate()} ${months[updatedDate.getMonth()]} ${updatedDate.getFullYear()}`;

  const genreNames = genres.map((genreId) => propsGenres.find(g => Number(g.id) === genreId)?.title || '').filter(Boolean);
  const genreString = genreNames.join(', ');

  const clickHandler = () => {
    onTileClick(propsPreview);
  };

  return (
    <div
      onClick={clickHandler}
      data-ref="preview-tile"
      className="h-100 w-50 pt-6 pb-6 flex flex-col items-start rounded-xl bg-white cursor-pointer hover:opacity-75"
    >
      <img src={image} className="h-44 w-44 mb-5 self-center rounded-lg" alt={title} />
      <div data-ref="preview-content" className="flex flex-col px-6 max-w-full">
        <h1 className="text-slate-800 font-bold mb-2 text-nowrap truncate">{title}</h1>
        <hr className="mb-2" />
        <p className="text-slate-800 text-sm">Seasons: {seasons}</p>
        <p className="text-slate-800 text-sm">Genres: {genreString}</p>
        <p className="text-slate-800 text-sm">Last updated: {updated}</p>
      </div>
    </div>
  );
}
