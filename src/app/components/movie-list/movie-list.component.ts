import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Actor } from 'src/app/models/actor';
import { Movie, Series } from 'src/app/models/movie';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.sass'],
})
export class MovieListComponent implements OnInit {
  constructor() {}

  @Input() items$: Observable<Array<Movie | Actor | Series>>;

  ngOnInit(): void {}
}
