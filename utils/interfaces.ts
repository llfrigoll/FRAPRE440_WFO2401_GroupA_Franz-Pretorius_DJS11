export interface Preview {
    id: string;
    title: string;
    description: string;
    seasons: number;
    image: string;
    genres: number[];
    updated: Date;
}

export interface Show {
    id: string;
    title: string;
    description: string;
    seasons: Season[];
    image: string;
    genres: string[];
    updated: Date;
}

export interface Season {
    season: number;
    title: string;
    image: string;
    episodes: Episode[]
}

export interface Episode {
    title: string;
    description: string;
    episode: number;
    file: string;
}

export interface Genre {
    id: number;
    title: string;
    description: string;
    shows: string[]
}