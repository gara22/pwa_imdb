import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { Observable } from 'rxjs';
import { Actor } from 'src/app/models/actor';
import { ActivatedRoute } from '@angular/router';
import { CombinedCredit } from 'src/app/models/movie';
import { tap, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-actor-details',
  templateUrl: './actor-details.component.html',
  styleUrls: ['./actor-details.component.sass'],
})
export class ActorDetailsComponent implements OnInit {
  constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute
  ) {}

  actor$: Observable<Actor>;
  credits$: Observable<CombinedCredit[]>;
  ngOnInit(): void {
    const id$ = this.activatedRoute.paramMap.pipe(
      map((params) => +params.get('id'))
    );
    this.actor$ = id$.pipe(
      switchMap((id) => this.movieService.getActorById(id))
    );
    this.credits$ = id$.pipe(
      switchMap((id) => this.movieService.getCombinedCredits(id))
    );
  }
}
