import { Component, OnInit, Input } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Observable } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';
import { MovieResponse, Movie, Series } from '../../models/movie';
import { Actor } from 'src/app/models/actor';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.sass'],
})
export class MovieListComponent implements OnInit {
  constructor(private movieService: MovieService) {}

  @Input() items$: Observable<Array<Movie | Actor | Series>>;

  ngOnInit(): void {
    console.log(this.items$);
  }
}
