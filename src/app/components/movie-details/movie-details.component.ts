import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, tap, switchMap, mapTo } from 'rxjs/operators';
import { Movie } from 'src/app/models/movie';

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

  movie$: Observable<Movie>;
  cast$: Observable<any>;
  loading = true;

  ngOnInit(): void {
    const id$ = this.activatedRoute.paramMap.pipe(
      map((params) => +params.get('id'))
    );

    this.movie$ = id$.pipe(
      switchMap((id) => this.movieService.getMovieById(id))
    );

    this.cast$ = id$.pipe(
      switchMap((id) => this.movieService.getCastByMovieId(id)),
      tap(() => (this.loading = false))
    );
  }
}
