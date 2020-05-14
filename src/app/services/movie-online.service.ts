import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Movie,
  serializeMovie,
  setImgPath,
  Series,
  serializeSeries,
} from '../models/movie';
import { map } from 'rxjs/operators';
import { Actor } from '../models/actor';

@Injectable({
  providedIn: 'root',
})
export class MovieOnlineService {
  constructor(private http: HttpClient) {}
  key = '267f208d9a12f8a4b5c873c8f3bb7fa2';

  getMovies(params?, page?: number): Observable<Movie[]> {
    let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${this.key}`;
    if (params.genreId) url += `&with_genres=${params.genreId}`;
    if (page) url += `&page=${page}`;

    return this.http.get(url).pipe(
      map((res) => {
        res['results'] = res['results'].map((movie) => {
          const ret = serializeMovie(
            movie['id'],
            movie['overview'],
            movie['poster_path'],
            movie['title'],
            'movie'
          );
          return ret;
        });

        return res['results'];
      })
    );
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
}
