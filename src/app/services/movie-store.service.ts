import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class MovieStoreService {
  private db$: Observable<IDBDatabase>;

  constructor() {
    this.initDb();
  }

  public getMovies(category: number): Observable<Movie[]> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<Movie[]>((subscriber) => {
            let transaction = db.transaction('movies');
            const request = transaction.objectStore('movies').get(category);
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

  public putMovies(category: number, movies: Movie[]): Observable<never> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<never>((subscriber) => {
            let transaction = db.transaction('movies', 'readwrite');
            transaction.objectStore('movies').put(movies, category);
            transaction.oncomplete = () => {
              transaction = null;
              subscriber.complete();
            };
            return () => transaction?.abort();
          })
      )
    );
  }

  private initDb(): void {
    this.db$ = new Observable<IDBDatabase>((subscriber) => {
      const openRequest = indexedDB.open('cache');
      openRequest.onupgradeneeded = () => this.createDb(openRequest.result);
      openRequest.onsuccess = () => {
        subscriber.next(openRequest.result);
        subscriber.complete();
      };
    }).pipe(shareReplay({ refCount: false, bufferSize: 1 }));
  }

  private createDb(db: IDBDatabase): void {
    db.createObjectStore('movies');
  }
}
