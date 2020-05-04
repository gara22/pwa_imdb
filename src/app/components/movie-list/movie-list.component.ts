import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Observable } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';
import { MovieResponse } from '../../models/movie';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.sass'],
})
export class MovieListComponent implements OnInit {
  constructor(private movieService: MovieService) {}

  movies: Observable<MovieResponse[]>;

  ngOnInit(): void {
    this.movies = this.movieService.getMovies().pipe(
      map((res) =>
        res.results.map((m) => {
          if (m.poster_path !== undefined)
            m.poster_path = `https://image.tmdb.org/t/p/w500/${m.poster_path}`;
          else
            m.poster_path =
              'http://www.inimco.com/wp-content/themes/consultix/images/no-image-found-360x260.png';
          return m;
        })
      ),
      tap((a) => console.log(a))
    );
  }
}
