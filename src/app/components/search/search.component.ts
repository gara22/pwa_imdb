import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Movie, Series } from 'src/app/models/movie';
import { Actor } from 'src/app/models/actor';
import { MovieService } from 'src/app/services/movie.service';
import {
  tap,
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass'],
})
export class SearchComponent implements OnInit {
  searchResults$: Observable<Array<Movie | Actor | Series>>;
  searchWord$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    // this.searchResults$ = this.movieService
    //   .searchMulti('george')
    //   .pipe(tap(console.log));

    this.searchResults$ = this.searchWord$.pipe(
      filter((word) => word.length > 2),
      tap(console.log),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((word) => this.movieService.searchMulti(word))
    );
    // this.searchResults$.subscribe(console.log);
  }
}
