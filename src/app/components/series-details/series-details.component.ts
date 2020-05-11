import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Series } from 'src/app/models/movie';
import { CastMember } from 'src/app/models/actor';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-series-details',
  templateUrl: './series-details.component.html',
  styleUrls: ['./series-details.component.sass'],
})
export class SeriesDetailsComponent implements OnInit {
  constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute
  ) {}

  series$: Observable<Series>;
  credits$: Observable<CastMember[]>;
  loading = true;

  ngOnInit(): void {
    const id$ = this.activatedRoute.paramMap.pipe(
      map((params) => +params.get('id'))
    );

    this.series$ = id$.pipe(
      switchMap((id) => this.movieService.getSeriesDetails(id))
    );
    this.credits$ = id$.pipe(
      switchMap((id) => this.movieService.getTVCredits(id)),
      tap(() => (this.loading = false))
    );
  }
}
