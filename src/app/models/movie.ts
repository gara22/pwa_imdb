export interface Movie {}

export interface MovieResponse {
  adult: boolean;
  backdrop_path: string;
  genre_ids: Array<number>;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface CombinedCredit {
  character: string;
  id: number;
  media_type: string;
  poster_path: string;
  release_date?: Date;
  title?: string;
  name?: string;
  first_air_date?;
}

export interface Series {
  first_air_date: Date;
  id: string;
  last_air_date: Date;
  name: string;
  overview: string;
  poster_path;
}
