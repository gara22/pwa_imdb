import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Movie, Series } from 'src/app/models/movie';
import { Actor } from 'src/app/models/actor';
import { MovieService } from 'src/app/services/movie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-toplist',
  templateUrl: './toplist.component.html',
  styleUrls: ['./toplist.component.sass'],
})
export class ToplistComponent implements OnInit {
  items$: Observable<Array<Movie | Actor | Series>>;
  page$: Observable<number>;
  genres$ = new BehaviorSubject<number>(12);
  genres = [];
  loading = true;

  constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  onPageAction(event) {
    this.loading = true;
    let page = event.pageIndex;
    let previousPageIndex = event.previousPageIndex;
    if (page > previousPageIndex) {
      this.router.navigate(['/toplist', 'page', page + 1]);
    } else if (page < previousPageIndex) {
      this.router.navigate(['/toplist', 'page', page + 1]);
    }
  }

  loadGenres() {
    const json = require('../../../assets/genres.json');
    this.genres = json.genres;
  }
  onSelect(event) {
    this.loading = true;
    this.genres$.next(event.value);
  }

  ngOnInit(): void {
    this.page$ = this.activatedRoute.paramMap.pipe(
      map((params) => +params.get('page') - 1, tap(console.log))
    );
    // this.items$ = this.page$.pipe(
    //   switchMap((page) => this.movieService.getMovies(null, page))
    // );

    this.items$ = this.page$.pipe(
      switchMap((page) => {
        return this.genres$.pipe(
          switchMap((genre) =>
            this.movieService.getMovies({ genreId: genre }, page + 1)
          )
        );
      }),
      tap(() => (this.loading = false))
    );
    this.loadGenres();
  }
}
