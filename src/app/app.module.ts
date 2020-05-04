import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { HttpClientModule } from '@angular/common/http';
import { MovieDetailsComponent } from './movie-details/movie-details.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, MovieListComponent, MovieDetailsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    HttpClientModule,
    MatListModule,
    MatCardModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
