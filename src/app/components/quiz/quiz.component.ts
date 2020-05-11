import { Component, OnInit, OnDestroy } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import {
  map,
  tap,
  debounceTime,
  takeUntil,
  take,
  finalize,
  last,
  switchMap,
} from 'rxjs/operators';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.sass'],
})
export class QuizComponent implements OnInit, OnDestroy {
  constructor(
    private movieService: MovieService,
    private quizService: QuizService
  ) {}

  imgSrc$: Observable<{
    url: string;
    titles: { title: string; goodAnswer: boolean; id: number }[];
  }>;
  loading: boolean = true;
  completed: boolean = false;
  score: number;
  quizSub: Subscription;
  scoreSub: Subscription;

  private shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  loadQuestion() {
    this.imgSrc$ = this.movieService.getRandomMovieImages().pipe(
      map((res) => {
        if (!res) {
          this.loadQuestion();
          return;
        }
        this.shuffle(res.titles);
        for (let i = 0; i < res.titles.length; i++) {
          res.titles[i] = {
            title: res.titles[i].title,
            goodAnswer: res.titles[i].goodAnswer,
            id: i,
          };
        }
        this.loading = false;
        return res;
      })
    );
  }

  newGame() {
    this.loading = true;
    this.quizService.newGame();
    this.completed = false;
    this.loadQuestion();
    this.initQuizService();
  }

  initQuizService() {
    this.quizSub = this.quizService
      .getAnswerSubj()
      .pipe(
        take(10),
        tap(() => {
          this.loadQuestion();
          this.loading = true;
        }),
        finalize(() => {
          this.loading = false;
          this.completed = true;
        })
      )
      .subscribe();

    this.scoreSub = this.quizService
      .getScore()
      .subscribe((score) => (this.score = score));
  }

  ngOnInit(): void {
    this.newGame();
  }
  ngOnDestroy() {
    this.quizSub.unsubscribe();
    this.scoreSub.unsubscribe();
  }
}
