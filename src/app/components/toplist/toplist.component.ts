import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Movie, Series } from 'src/app/models/movie';
import { Actor } from 'src/app/models/actor';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-toplist',
  templateUrl: './toplist.component.html',
  styleUrls: ['./toplist.component.sass'],
})
export class ToplistComponent implements OnInit {
  items$: Observable<Array<Movie | Actor | Series>>;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.items$ = this.movieService.getMovies();
  }
}
