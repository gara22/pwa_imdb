import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Article } from '../models/article';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private http: HttpClient) {}

  key = '062e9f870b334a74ab140177bb0b26e3';

  getArticles(): Observable<Article[]> {
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
      ),
      tap(console.log)
    );
  }
}
