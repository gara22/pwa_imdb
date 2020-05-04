import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Series } from 'src/app/models/movie';
import { CastMember } from 'src/app/models/actor';

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

  ngOnInit(): void {
    let id;
    this.activatedRoute.paramMap.subscribe((res) => (id = res.get('id')));
    this.series$ = this.movieService.getSeriesDetails(id);
    this.credits$ = this.movieService.getTVCredits(id);
  }
}
