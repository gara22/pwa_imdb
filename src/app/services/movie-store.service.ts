import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { Movie, Series } from '../models/movie';
import { CacheService } from './cache.service';
import { Actor } from '../models/actor';

@Injectable({
  providedIn: 'root',
})
export class MovieStoreService {
  private db$: Observable<IDBDatabase>;

  constructor(private cacheService: CacheService) {
    this.db$ = this.cacheService.getDb();
  }

  public getMovies(category: number, page: number): Observable<Movie[]> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<Movie[]>((subscriber) => {
            let transaction = db.transaction('movies');
            let key = category.toString() + '_' + page.toString();
            const request = transaction.objectStore('movies').get(key);
            transaction.oncomplete = () => {
              transaction = null;
              subscriber.next(request.result);
              subscriber.complete();
            };
            return () => transaction?.abort();
          })
      )
    );
  }

  public putMovies(
    category: number,
    page: number,
    movies: Movie[]
  ): Observable<never> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<never>((subscriber) => {
            let key = category.toString() + '_' + page.toString();
            let transaction = db.transaction('movies', 'readwrite');
            transaction.objectStore('movies').put(movies, key);
            transaction.oncomplete = () => {
              transaction = null;
              subscriber.complete();
            };
            return () => transaction?.abort();
          })
      )
    );
  }

  getMovieById(id: number): Observable<Movie> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<Movie>((subscriber) => {
            let transaction = db.transaction('movie');
            const request = transaction.objectStore('movie').get(id);
            transaction.oncomplete = () => {
              transaction = null;
              subscriber.next(request.result);
              subscriber.complete();
            };
            return () => transaction?.abort();
          })
      )
    );
  }

  public putMovie(id: number, movie: Movie): Observable<never> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<never>((subscriber) => {
            let transaction = db.transaction('movie', 'readwrite');
            transaction.objectStore('movie').put(movie, id);
            transaction.oncomplete = () => {
              transaction = null;
              subscriber.complete();
            };
            return () => transaction?.abort();
          })
      )
    );
  }

  getActorById(id: number): Observable<Actor> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<Actor>((subscriber) => {
            let transaction = db.transaction('actor');
            const request = transaction.objectStore('actor').get(id);
            transaction.oncomplete = () => {
              transaction = null;
              subscriber.next(request.result);
              subscriber.complete();
            };
            return () => transaction?.abort();
          })
      )
    );
  }

  public putActor(id: number, actor: Actor): Observable<never> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<never>((subscriber) => {
            let transaction = db.transaction('actor', 'readwrite');
            transaction.objectStore('actor').put(actor, id);
            transaction.oncomplete = () => {
              transaction = null;
              subscriber.complete();
            };
            return () => transaction?.abort();
          })
      )
    );
  }

  getSeriesById(id: number): Observable<Series> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<Series>((subscriber) => {
            let transaction = db.transaction('series');
            const request = transaction.objectStore('series').get(id);
            transaction.oncomplete = () => {
              transaction = null;
              subscriber.next(request.result);
              subscriber.complete();
            };
            return () => transaction?.abort();
          })
      )
    );
  }

  public putSeries(id: number, series: Series): Observable<never> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<never>((subscriber) => {
            let transaction = db.transaction('series', 'readwrite');
            transaction.objectStore('series').put(series, id);
            transaction.oncomplete = () => {
              transaction = null;
              subscriber.complete();
            };
            return () => transaction?.abort();
          })
      )
    );
  }

  getSearchResult(term: string): Observable<Array<Movie | Actor | Series>> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<Array<Movie | Actor | Series>>((subscriber) => {
            let transaction = db.transaction('search');
            const request = transaction.objectStore('search').get(term);
            transaction.oncomplete = () => {
              transaction = null;
              subscriber.next(request.result);
              subscriber.complete();
            };
            return () => transaction?.abort();
          })
      )
    );
  }

  public putSearch(
    term: string,
    results: Array<Movie | Actor | Series>
  ): Observable<never> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<never>((subscriber) => {
            let transaction = db.transaction('search', 'readwrite');
            transaction.objectStore('search').put(results, term);
            transaction.oncomplete = () => {
              transaction = null;
              subscriber.complete();
            };
            return () => transaction?.abort();
          })
      )
    );
  }
}
