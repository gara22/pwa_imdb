import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CombinedCredit,
  Series,
  Movie,
  serializeMovie,
  serializeSeries,
  setImgPath,
} from '../models/movie';
import { Observable, of } from 'rxjs';
import { CastMember, Actor, serializeActor } from '../models/actor';
import { map, tap, switchMap, delayWhen, defaultIfEmpty } from 'rxjs/operators';
import { MovieStoreService } from './movie-store.service';
import { MovieOnlineService } from './movie-online.service';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  key = '267f208d9a12f8a4b5c873c8f3bb7fa2';

  constructor(
    private http: HttpClient,
    private movieStoreService: MovieStoreService,
    private movieOnlineService: MovieOnlineService
  ) {}

  getMovies(params?, page?: number): Observable<Movie[]> {
    return this.movieStoreService
      .getMovies(params.genreId, page)
      .pipe(
        switchMap((cachedMovies) =>
          !cachedMovies && navigator.onLine
            ? this.movieOnlineService
                .getMovies(params, page)
                .pipe(
                  delayWhen((movies) =>
                    this.movieStoreService
                      .putMovies(params.genreId, page, movies)
                      .pipe(defaultIfEmpty(undefined))
                  )
                )
            : of(cachedMovies)
        )
      );
  }

  getMovieById(id: number) {
    return this.movieStoreService
      .getMovieById(id)
      .pipe(
        switchMap((cachedMovie) =>
          !cachedMovie && navigator.onLine
            ? this.movieOnlineService
                .getMovieById(id)
                .pipe(
                  delayWhen((movie) =>
                    this.movieStoreService
                      .putMovie(id, movie)
                      .pipe(defaultIfEmpty(undefined))
                  )
                )
            : of(cachedMovie)
        )
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
    return this.movieStoreService
      .getActorById(id)
      .pipe(
        switchMap((cachedActor) =>
          !cachedActor && navigator.onLine
            ? this.movieOnlineService
                .getActorById(id)
                .pipe(
                  delayWhen((actor) =>
                    this.movieStoreService
                      .putActor(id, actor)
                      .pipe(defaultIfEmpty(undefined))
                  )
                )
            : of(cachedActor)
        )
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
    return this.movieStoreService
      .getSeriesById(id)
      .pipe(
        switchMap((cachedSeries) =>
          !cachedSeries && navigator.onLine
            ? this.movieOnlineService
                .getSeriesDetails(id)
                .pipe(
                  delayWhen((series) =>
                    this.movieStoreService
                      .putSeries(id, series)
                      .pipe(defaultIfEmpty(undefined))
                  )
                )
            : of(cachedSeries)
        )
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
    return this.movieStoreService
      .getSearchResult(searchTerm)
      .pipe(
        switchMap((cachedResults) =>
          !cachedResults && navigator.onLine
            ? this.movieOnlineService
                .searchMulti(searchTerm)
                .pipe(
                  delayWhen((results) =>
                    this.movieStoreService
                      .putSearch(searchTerm, results)
                      .pipe(defaultIfEmpty(undefined))
                  )
                )
            : of(cachedResults)
        )
      );
  }

  getRandomMovieImages(): Observable<{
    url: string;
    titles: { title: string; goodAnswer: boolean; id: number }[];
  }> {
    let randPage = Math.floor(Math.random() * (500 - 1) + 1);
    let randItem = Math.floor(Math.random() * (20 - 1) + 1);
    let titles = [];
    return this.http
      .get(
        `https://api.themoviedb.org/3/discover/movie?api_key=267f208d9a12f8a4b5c873c8f3bb7fa2&page=${randPage}`
      )
      .pipe(
        tap((res) => {
          let movieId = res['results'][randItem]['id'];
          for (let i = 0; i < 3; i++) {
            if (movieId !== res['results'][i]['id']) {
              titles.push({
                title: res['results'][i]['title'],
                goodAnswer: false,
              });
            } else {
              titles.push({
                title: res['results'][3]['title'],
                goodAnswer: false,
              });
            }
          }
          titles.push({
            title: res['results'][randItem]['title'],
            goodAnswer: true,
          });
        }),
        map((res) => res['results'][randItem]['id']),
        switchMap((id) => this.getImagesOfMovie(id)),
        map((res) => {
          if (res['backdrops'].length > 0) {
            let ret = {
              url: setImgPath(res['backdrops'][0]['file_path']),
              titles: titles,
            };

            return ret;
          }
          return null;
        })
      );
  }

  getImagesOfMovie(id) {
    let url = `https://api.themoviedb.org/3/movie/${id}/images?api_key=${this.key}`;
    return this.http.get(url);
  }
}
