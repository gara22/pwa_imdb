import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/services/news.service';
import { Observable } from 'rxjs';
import { Article } from 'src/app/models/article';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.sass'],
})
export class NewsComponent implements OnInit {
  constructor(private newsService: NewsService) {}

  news$: Observable<Article[]>;

  seeArticle(url) {
    window.open(url, '_blank');
  }

  ngOnInit(): void {
    this.news$ = this.newsService.getArticles();
  }
}
