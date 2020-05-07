import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie, Series } from 'src/app/models/movie';
import { Actor } from 'src/app/models/actor';
import { MovieService } from 'src/app/services/movie.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.sass'],
})
export class SearchComponent implements OnInit {
  searchResults$: Observable<Array<Movie | Actor | Series>>;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.searchResults$ = this.movieService
      .searchMulti('leonardo')
      .pipe(tap(console.log));
    // this.searchResults$.subscribe(console.log);
  }
}
