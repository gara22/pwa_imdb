import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  MovieResponse,
  CombinedCredit,
  Series,
  Movie,
  serializeMovie,
  serializeSeries,
} from '../models/movie';
import { Observable } from 'rxjs';
import { CastMember, Actor, serializeActor } from '../models/actor';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  key = '267f208d9a12f8a4b5c873c8f3bb7fa2';

  constructor(private http: HttpClient) {}

  getMovies(params?) {
    let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${this.key}`;

    return this.http.get<{
      page: number;
      results: Array<MovieResponse>;
      total_pages: number;
      total_results: number;
    }>(url);
  }

  getMovieById(id: number): Observable<Movie> {
    let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.key}`;
    return this.http.get(url).pipe(
      map((res) => {
        return serializeMovie(
          res['id'],
          res['overview'],
          res['poster_path'],
          res['title'],
          res['media_type']
        );
      })
    );
  }

  getCastByMovieId(id: number): Observable<CastMember> {
    let url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${this.key}`;
    return this.http.get(url).pipe(
      map((res) => res['cast']),
      map((cast) =>
        cast.map((castMember) => {
          return {
            character: castMember['character'],
            id: castMember['id'],
            name: castMember['name'],
            profile_path: setImgPath(castMember['profile_path']),
          };
        })
      )
    );
  }
  getActorById(id: number): Observable<Actor> {
    let url = `https://api.themoviedb.org/3/person/${id}?api_key=${this.key}`;
    return this.http.get(url).pipe(
      map((res) => {
        return {
          biography: res['biography'],
          birthday: res['birthday'],
          deathday: res['deathday'],
          id: res['id'],
          known_for_department: res['known_for_department'],
          name: res['name'],
          place_of_birth: res['place_of_birth'],
          profile_path: setImgPath(res['profile_path']),
        };
      })
    );
  }

  getCombinedCredits(actorId: number): Observable<CombinedCredit[]> {
    let url = `https://api.themoviedb.org/3/person/${actorId}/combined_credits?api_key=${this.key}`;
    return this.http.get(url).pipe(
      map((res) =>
        res['cast'].map((c) => {
          return {
            character: c.character,
            id: c.id,
            media_type: c.media_type,
            poster_path: setImgPath(c.poster_path),
            release_date: c.release_date ? new Date(c.release_date) : null,
            title: c.title,
            name: c.name,
            first_air_date: c.first_air_date
              ? new Date(c.first_air_date)
              : null,
          };
        })
      )
    );
  }

  getSeriesDetails(id: number): Observable<Series> {
    let url = `https://api.themoviedb.org/3/tv/${id}?api_key=${this.key}`;
    return this.http.get(url).pipe(
      map((res) => {
        return serializeSeries(
          res['first_air_date'],

          res['id'],
          res['last_air_date'],

          res['name'],
          res['overview'],
          res['poster_path'],
          res['media_type']
        );
      })
    );
  }

  getTVCredits(id: number): Observable<CastMember[]> {
    let tvCreditURL = `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${this.key}`;
    return this.http.get(tvCreditURL).pipe(
      map((res) => res['cast']),
      map((cast) =>
        cast.map((castMember) => {
          return {
            character: castMember['character'],
            id: castMember['id'],
            name: castMember['name'],
            profile_path: setImgPath(castMember['profile_path']),
          };
        })
      )
    );
  }

  searchMulti(searchTerm: string): Observable<Array<Movie | Actor | Series>> {
    return this.http
      .get(
        `https://api.themoviedb.org/3/search/multi?api_key=${this.key}&query=${searchTerm}`
      )
      .pipe(
        map((res) =>
          res['results'].map((obj) => {
            if (obj['media_type'] === 'person') {
              console.log(obj);
              return serializeActor(
                obj['biography'],
                obj['birthday'],
                obj['deathday'],
                obj['id'],
                obj['known_for_department'],
                obj['name'],
                obj['place_of_birth'],
                obj['profile_path'],
                obj['media_type']
              );
            } else if (obj['media_type'] === 'movie')
              return serializeMovie(
                obj['id'],
                obj['overview'],
                obj['poster_path'],
                obj['title'],
                obj['media_type']
              );
            else if (obj['media_type'] === 'tv')
              return serializeSeries(
                obj['first_air_date'],
                obj['id'],
                obj['last_air_date'],
                obj['name'],
                obj['overview'],
                obj['poster_path'],
                obj['media_type']
              );
          })
        )
      );
  }
}

export function setImgPath(path: string) {
  if (path) return 'https://image.tmdb.org/t/p/w500' + path;
  return 'http://www.inimco.com/wp-content/themes/consultix/images/no-image-found-360x260.png';
}
