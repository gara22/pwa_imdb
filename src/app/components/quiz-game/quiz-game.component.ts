import { Component, OnInit, Input, Output } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz-game',
  templateUrl: './quiz-game.component.html',
  styleUrls: ['./quiz-game.component.sass'],
})
export class QuizGameComponent implements OnInit {
  @Input() src$: Observable<{
    url: string;
    titles: { title: string; goodAnswer: boolean }[];
  }>;
  answered: boolean;

  constructor(private quizService: QuizService) {}

  selectAnswer(answer: { title: string; goodAnswer: boolean; id: number }) {
    if (answer.goodAnswer) this.answered = true;
    if (!answer.goodAnswer) {
      this.answered = true;
      answer.id = 4;
    }

    // if (answer.goodAnswer) this.answered = true;
    // else this.answered = false;
    // setTimeout(() => {
    //   this.answerSubject.next(answer);
    // }, 3000);

    setTimeout(() => {
      this.quizService.answer(answer);
      this.answered = false;
    }, 800);
  }

  ngOnInit(): void {}
}
