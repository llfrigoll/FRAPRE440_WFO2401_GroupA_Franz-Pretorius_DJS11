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
    seasons: Season[]
}

export interface Season {
    id: string;
    title: string;
    image: string;
    episodes: Episode[]
}

export interface Episode {
    id: string;
    file: string;
    title: string;
}

export interface Genre {
    id: string;
    title: string;
    description: string;
    shows: string[]
}