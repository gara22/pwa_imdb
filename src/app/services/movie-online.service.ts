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
import { Actor, serializeActor } from '../models/actor';

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

  searchMulti(searchTerm: string): Observable<Array<Movie | Actor | Series>> {
    return this.http
      .get(
        `https://api.themoviedb.org/3/search/multi?api_key=${this.key}&query=${searchTerm}`
      )
      .pipe(
        map((res) =>
          res['results'].map((obj) => {
            if (obj['media_type'] === 'person') {
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
