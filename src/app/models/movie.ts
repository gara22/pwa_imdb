export interface Movie {
  id: number;
  overview: string;
  poster_path: string;
  title: string;
  media_type: string;
}

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
  media_type: string;
}

export function serializeSeries(
  first_air_date: string,
  id: string,
  last_air_date: string,
  name: string,
  overview: string,
  poster_path: string,
  media_type: string
): Series {
  return {
    first_air_date: first_air_date ? new Date(first_air_date) : null,
    id: id,
    last_air_date: last_air_date ? new Date(last_air_date) : null,
    name: name,
    overview: overview,
    poster_path: setImgPath(poster_path),
    media_type: media_type,
  };
}

export function serializeMovie(
  id: number,
  overview: string,
  poster_path: string,
  title: string,
  media_type: string
): Movie {
  return {
    id: id,
    overview: overview,
    poster_path: setImgPath(poster_path),
    title: title,
    media_type: media_type,
  };
}

export function setImgPath(path: string): string {
  if (path) return 'https://image.tmdb.org/t/p/w500' + path;
  return 'http://www.inimco.com/wp-content/themes/consultix/images/no-image-found-360x260.png';
}
