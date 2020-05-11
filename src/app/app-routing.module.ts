import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { ActorDetailsComponent } from './components/actor-details/actor-details.component';
import { SeriesDetailsComponent } from './components/series-details/series-details.component';
import { SearchComponent } from './components/search/search.component';
import { QuizComponent } from './components/quiz/quiz.component';
import { ToplistComponent } from './components/toplist/toplist.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: 'movies/:id', component: MovieDetailsComponent },
  { path: 'actor/:id', component: ActorDetailsComponent },
  { path: 'series/:id', component: SeriesDetailsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'toplist/page/:page', component: ToplistComponent },
  { path: 'home', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
