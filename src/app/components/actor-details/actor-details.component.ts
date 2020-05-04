import { Component, OnInit } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { Observable } from 'rxjs';
import { Actor } from 'src/app/models/actor';
import { ActivatedRoute } from '@angular/router';
import { CombinedCredit } from 'src/app/models/movie';
import { tap } from 'rxjs/operators';

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
    let id;
    this.activatedRoute.paramMap.subscribe((res) => (id = res.get('id')));
    this.actor$ = this.movieService.getActorById(id);
    this.credits$ = this.movieService
      .getCombinedCredits(id)
      .pipe(tap((a) => console.log(a)));
  }
}
