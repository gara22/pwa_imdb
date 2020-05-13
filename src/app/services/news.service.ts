import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, shareReplay, switchMap, concatMap } from 'rxjs/operators';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {
    this.initDb();
  }
  private db$: Observable<IDBDatabase>;

  key = '062e9f870b334a74ab140177bb0b26e3';

  getArticles(): Observable<Article[]> {
    return this.getArticlesFromCache().pipe(
      switchMap((cachedArticles) => {
        if (cachedArticles.length > 0) {
          return of(cachedArticles);
        } else if (navigator.onLine) {
          return this.getArticlesFromApi().pipe(
            tap((articles) => {
              this.putArticles(articles).subscribe(); // tudom h csúnya, de nem sikerült rájönnöm h kéne :(
            })
          );
        } else {
          return of(undefined);
        }
      })
    );
  }

  getArticlesFromApi(): Observable<Article[]> {
    let url = `https://newsapi.org/v2/everything?q=film&apiKey=${this.key}`;
    return this.http.get(url).pipe(
      map((res) =>
        res['articles'].map((article) => {
          const ret: Article = {
            author: article['author'],
            title: article['title'],
            description: article['description'],
            urlToImage: article['urlToImage'],
            url: article['url'],
            content: article['content'],
          };
          return ret;
        })
      )
    );
  }

  getArticlesFromCache(): Observable<Article[]> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<Article[]>((subscriber) => {
            let transaction = db.transaction('article');
            const request = transaction.objectStore('article').getAll();

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

  putArticles(articles: Article[]): Observable<never> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<never>((subscriber) => {
            let transaction = db.transaction('article', 'readwrite');
            articles.forEach((article) =>
              transaction.objectStore('article').put(article, article.url)
            );
            transaction.oncomplete = () => {
              console.log('articles added succ');

              transaction = null;
              subscriber.complete();
            };

            transaction.onerror = (err) => {
              console.log(err);
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
    db.createObjectStore('article');
  }
}
