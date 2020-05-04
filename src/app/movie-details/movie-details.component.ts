import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MovieResponse } from '../models/movie';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.sass'],
})
export class MovieDetailsComponent implements OnInit {
  constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute
  ) {}

  movie$: Observable<MovieResponse>;

  ngOnInit(): void {
    let id;
    this.activatedRoute.paramMap.subscribe((res) => (id = res.get('id')));
    this.movie$ = this.movieService.getMovieById(id).pipe(
      map((m) => {
        m.poster_path = `https://image.tmdb.org/t/p/w500/${m.poster_path}`;
        return m;
      })
    );
    console.log(this.movie$);
  }
}
