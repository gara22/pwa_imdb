import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private db$: Observable<IDBDatabase>;

  constructor() {
    this.initDb();
  }

  getDb() {
    return this.db$;
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
    db.createObjectStore('article');
    db.createObjectStore('movies');
    db.createObjectStore('movie');
    db.createObjectStore('actor');
    db.createObjectStore('series');
  }
}
