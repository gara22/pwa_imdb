import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MovieResponse } from '../models/movie';

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

  getMovieById(id: number) {
    let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.key}`;
    return this.http.get<MovieResponse>(url);
  }

  getCastByMovieId(id: number) {
    let url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${this.key}`;
    return this.http.get(url);
  }
}
